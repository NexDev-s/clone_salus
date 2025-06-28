import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, User, Search, Plus, Edit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointments, Appointment } from '@/hooks/useAppointments';
import { usePatients, Patient } from '@/hooks/usePatients';
import { useProfessionals, Professional } from '@/hooks/useProfessionals';
import { useAuth } from '@/hooks/useAuth';

const AppointmentScheduling = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { getAppointments, loading } = useAppointments();
  const { getPatients } = usePatients();
  const { getProfessionals } = useProfessionals();
  const { user, session } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        console.log('🔄 Aguardando autenticação para carregar agendamentos...');
        return;
      }

      console.log('✅ Carregando dados dos agendamentos...');
      
      try {
        const [appointmentsData, patientsData, professionalsData] = await Promise.all([
          getAppointments(),
          getPatients(),
          getProfessionals()
        ]);
        
        console.log('📋 Dados carregados:');
        console.log('- Agendamentos:', appointmentsData.length);
        console.log('- Pacientes:', patientsData.length);
        console.log('- Profissionais:', professionalsData.length);
        
        setAppointments(appointmentsData);
        setPatients(patientsData);
        setProfessionals(professionalsData);
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
      }
    };
    
    loadData();
  }, [user, session]);

  // Filtrar agendamentos por data e busca
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.data_agendamento).toISOString().split('T')[0];
    const matchesDate = appointmentDate === selectedDate;
    
    if (!matchesDate) return false;
    
    if (!searchTerm) return true;
    
    const patient = patients.find(p => p.id === appointment.patient_id);
    const professional = professionals.find(p => p.id === appointment.professional_id);
    
    const patientName = appointment.patientName || patient?.nome || '';
    const professionalName = appointment.professionalName || professional?.nome || '';
    
    return (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'presente': return 'bg-blue-100 text-blue-800';
      case 'finalizado': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Mostrar loading enquanto autentica
  const currentUser = user || session?.user;
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Autenticando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mr-4 hover:bg-blue-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Calendar className="text-white h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
                <p className="text-gray-600">{filteredAppointments.length} consulta(s) para {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>
                  Agende uma nova consulta para o paciente
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paciente">Paciente</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novo">+ Cadastrar novo paciente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="profissional">Profissional</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novo">+ Cadastrar novo profissional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="hora">Horário</Label>
                    <Input id="hora" type="time" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="duracao">Duração</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo de Consulta</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consulta">Consulta</SelectItem>
                        <SelectItem value="retorno">Retorno</SelectItem>
                        <SelectItem value="exame">Exame</SelectItem>
                        <SelectItem value="procedimento">Procedimento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="convenio">Convênio</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o convênio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="particular">Particular</SelectItem>
                        <SelectItem value="unimed">Unimed</SelectItem>
                        <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input id="observacoes" placeholder="Observações sobre a consulta" className="mt-1" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                  Agendar Consulta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <Card className="mb-6 shadow-lg border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <Label htmlFor="data-filtro">Data</Label>
                <Input
                  id="data-filtro"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="busca">Buscar</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="busca"
                    placeholder="Buscar por paciente ou profissional..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="profissional-filtro">Profissional</Label>
                <Select>
                  <SelectTrigger className="mt-1 w-48">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os profissionais</SelectItem>
                    {professionals.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando agendamentos...</p>
          </div>
        )}

        {/* Lista de Agendamentos */}
        {!loading && filteredAppointments.length > 0 && (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const patient = patients.find(p => p.id === appointment.patient_id);
              const professional = professionals.find(p => p.id === appointment.professional_id);
              const appointmentTime = new Date(appointment.data_agendamento);
              
              return (
                <Card key={appointment.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.patientName || patient?.nome || 'Paciente não encontrado'}
                          </h3>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{appointmentTime.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</span>
                            <span className="mx-2">•</span>
                            <span>{appointment.tipo}</span>
                            <span className="mx-2">•</span>
                            <span>{appointment.professionalName || professional?.nome || 'Profissional não encontrado'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={`${getStatusColor(appointment.status || 'agendado')}`}>
                          {appointment.status || 'Agendado'}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {appointment.observacoes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Observações:</strong> {appointment.observacoes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Estado Vazio */}
        {!loading && filteredAppointments.length === 0 && (
          <Card className="shadow-lg border-blue-200">
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {appointments.length === 0 ? 'Nenhum agendamento encontrado' : 'Nenhum agendamento para esta data'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {appointments.length === 0 
                  ? 'Você ainda não possui agendamentos. Comece criando seu primeiro agendamento.'
                  : 'Não há consultas agendadas para a data selecionada. Selecione outra data ou crie um novo agendamento.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Agendamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Novo Agendamento</DialogTitle>
                      <DialogDescription>
                        Agende uma nova consulta para o paciente
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="paciente">Paciente</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Selecione o paciente" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="novo">+ Cadastrar novo paciente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="profissional">Profissional</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Selecione o profissional" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="novo">+ Cadastrar novo profissional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="data">Data</Label>
                          <Input id="data" type="date" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="hora">Horário</Label>
                          <Input id="hora" type="time" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="duracao">Duração</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutos</SelectItem>
                              <SelectItem value="45">45 minutos</SelectItem>
                              <SelectItem value="60">60 minutos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tipo">Tipo de Consulta</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consulta">Consulta</SelectItem>
                              <SelectItem value="retorno">Retorno</SelectItem>
                              <SelectItem value="exame">Exame</SelectItem>
                              <SelectItem value="procedimento">Procedimento</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="convenio">Convênio</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Selecione o convênio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="particular">Particular</SelectItem>
                              <SelectItem value="unimed">Unimed</SelectItem>
                              <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Input id="observacoes" placeholder="Observações sobre a consulta" className="mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancelar</Button>
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                        Agendar Consulta
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={() => onBack()}>
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduling;
