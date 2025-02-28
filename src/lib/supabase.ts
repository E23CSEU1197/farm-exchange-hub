
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// User profile helper functions
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

// Machine related helper functions
export async function fetchAllMachines() {
  const { data, error } = await supabase
    .from('machines')
    .select(`
      *,
      owner:profiles(id, full_name, location, phone)
    `)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching machines:', error);
    return [];
  }
  
  return data;
}

export async function fetchUserMachines(userId: string) {
  const { data, error } = await supabase
    .from('machines')
    .select(`
      *,
      owner:profiles(id, full_name, location, phone)
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching user machines:', error);
    return [];
  }
  
  return data;
}

export async function fetchMachineById(id: string) {
  const { data, error } = await supabase
    .from('machines')
    .select(`
      *,
      owner:profiles(id, full_name, location, phone)
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching machine:', error);
    return null;
  }
  
  return data;
}

export async function createMachine(machineData: any) {
  const { data, error } = await supabase
    .from('machines')
    .insert([machineData])
    .select();
    
  if (error) {
    console.error('Error creating machine:', error);
    return null;
  }
  
  return data[0];
}

export async function updateMachine(id: string, updates: any) {
  const { data, error } = await supabase
    .from('machines')
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating machine:', error);
    return null;
  }
  
  return data[0];
}

export async function deleteMachine(id: string) {
  const { error } = await supabase
    .from('machines')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting machine:', error);
    return false;
  }
  
  return true;
}

// BarterRequest functions
export async function createBarterRequest(requestData: any) {
  const { data, error } = await supabase
    .from('barter_requests')
    .insert([requestData])
    .select();
    
  if (error) {
    console.error('Error creating barter request:', error);
    return null;
  }
  
  return data[0];
}

export async function fetchSentBarterRequests(userId: string) {
  const { data, error } = await supabase
    .from('barter_requests')
    .select(`
      *,
      requesting_machine:machines(*),
      offered_machine:machines(*),
      requesting_user:profiles(id, full_name, location, phone),
      offering_user:profiles(id, full_name, location, phone)
    `)
    .eq('requester_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching sent barter requests:', error);
    return [];
  }
  
  return data;
}

export async function fetchReceivedBarterRequests(userId: string) {
  const { data, error } = await supabase
    .from('barter_requests')
    .select(`
      *,
      requesting_machine:machines(*),
      offered_machine:machines(*),
      requesting_user:profiles(id, full_name, location, phone),
      offering_user:profiles(id, full_name, location, phone)
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching received barter requests:', error);
    return [];
  }
  
  return data;
}

export async function updateBarterRequestStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('barter_requests')
    .update({ status })
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating barter request status:', error);
    return null;
  }
  
  return data[0];
}
