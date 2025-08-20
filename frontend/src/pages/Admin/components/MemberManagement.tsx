import { useState, useEffect } from 'react';
import MemberForm from './MemberForm';
import MemberList from './MemberList';
import type { Member } from '../../../api/types';
import DelayedLoadingSpinner from '../../../components/DelayedLoadingSpinner';
import { getMembers, createMember, updateMember, deleteMember } from '../../../api';
import { supabase } from '../../../utils/supabaseClient';

export default function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      setError('Error fetching members');
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (memberData: Member) => {
    try {
      const newMember = await createMember(memberData as any);
      setMembers([...members, newMember]);
      setShowForm(false);
      setEditingMember(null);
    } catch (error) {
      setError('Error adding member');
    }
  };


  const editMember = async (memberData: Member) => {
    try {
      await updateMember(memberData);
      setShowForm(false);
      setEditingMember(null);
      setMembers(members.map(member => member.id === memberData.id ? memberData : member));
    } catch (error) {
      setError('Error updating member');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }

    try {
      // delete all images in the member's folder
      const { data: entries, error: listErr } = await supabase
        .storage
        .from('profile-pics')
        .list(memberId, {
          limit: 100,
          offset: 0,
        });
      if (listErr) {
      }
      for (const entry of entries || []) {
        await supabase
          .storage
          .from('profile-pics')
          .remove([`${memberId}/${entry.name}`]);
      }
      await deleteMember(memberId);
      setMembers(members.filter(member => member.id !== memberId));
    } catch (error) {
      setError('Error deleting member');
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  if (isLoading) {
    return <DelayedLoadingSpinner isLoading={isLoading} size="lg" className="h-32" />;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">Member Management</div>
      </div>

      {showForm ? (
        <MemberForm
          member={editingMember}
          onSubmit={editingMember ? editMember : addMember}
          onCancel={handleCancel}
        />
      ) : (
        <MemberList
          members={members}
          onEdit={handleEdit}
          onDelete={handleDeleteMember}
        />
      )}
    </div>
  );
} 
