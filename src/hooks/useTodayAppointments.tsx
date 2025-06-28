
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
      console.log('⏳ DEBUG: useTodayAppointments - Aguardando autenticação...');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📅 DEBUG: useTodayAppointments - Carregando agendamentos para usuário:', currentUser.email);
      console.log('🔍 DEBUG: useTodayAppointments - ID do usuário:', currentUser.id);
      
      const hoje = new Date().toISOString().split('T')[0];
      console.log('📅 DEBUG: useTodayAppointments - Data de hoje:', hoje);
      
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
        console.error('❌ DEBUG: useTodayAppointments - Erro na query:', error);
        throw error;
      }

      console.log('📊 DEBUG: useTodayAppointments - Raw data:', data);
      console.log('📊 DEBUG: useTodayAppointments - Quantidade encontrada:', data?.length || 0);

      const formattedAppointments = data?.map(apt => {
        const formatted = {
          id: apt.id,
          time: new Date(apt.data_agendamento).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          patient: apt.patient?.nome || 'Paciente não encontrado',
          doctor: apt.professional?.nome || 'Profissional não encontrado',
          type: apt.tipo || 'Consulta',
          status: apt.status || 'agendado'
        };
        
        console.log('📋 DEBUG: useTodayAppointments - Agendamento formatado:', formatted);
        return formatted;
      }) || [];

      console.log('✅ DEBUG: useTodayAppointments - Agendamentos de hoje formatados:', formattedAppointments);
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('❌ DEBUG: useTodayAppointments - Erro geral:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = user || session?.user;
    
    if (currentUser) {
      console.log('🔄 DEBUG: useTodayAppointments - Iniciando carregamento...');
      loadTodayAppointments();
    } else {
      console.log('⏳ DEBUG: useTodayAppointments - Sem usuário autenticado');
      setLoading(false);
      setAppointments([]);
    }
  }, [user?.id, session?.user?.id]);

  return { appointments, loading, refreshAppointments: loadTodayAppointments };
};
