
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TodayAppointment {
  id: string;
  time: string;
  patient: string;
  doctor: string;
  type: string;
  status: string;
}

export const useTodayAppointments = () => {
  const [appointments, setAppointments] = useState<TodayAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  const loadTodayAppointments = async () => {
    // Verificar tanto user quanto session para autenticação
    const currentUser = user || session?.user;
    
    if (!currentUser) {
      console.log('⏳ Aguardando autenticação para carregar agendamentos...');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📅 Carregando agendamentos de hoje para usuário:', currentUser.id);
      
      const hoje = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(nome),
          professional:professionals(nome)
        `)
        .eq('user_id', currentUser.id)
        .gte('data_agendamento', hoje)
        .lt('data_agendamento', hoje + 'T23:59:59')
        .order('data_agendamento', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar agendamentos:', error);
        throw error;
      }

      const formattedAppointments = data?.map(apt => ({
        id: apt.id,
        time: new Date(apt.data_agendamento).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        patient: apt.patient?.nome || 'Paciente não encontrado',
        doctor: apt.professional?.nome || 'Profissional não encontrado',
        type: apt.tipo || 'Consulta',
        status: apt.status || 'agendado'
      })) || [];

      console.log('✅ Agendamentos de hoje carregados:', formattedAppointments.length);
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('❌ Erro ao carregar agendamentos de hoje:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = user || session?.user;
    
    if (currentUser) {
      console.log('🔄 Iniciando carregamento de agendamentos de hoje...');
      loadTodayAppointments();
    } else {
      setLoading(false);
      setAppointments([]);
    }
  }, [user?.id, session?.user?.id]);

  return { appointments, loading, refreshAppointments: loadTodayAppointments };
};
