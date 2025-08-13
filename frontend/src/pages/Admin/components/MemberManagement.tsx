import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import MemberForm from './MemberForm';
import MemberList from './MemberList';
import type { Member } from '../../../types/Member';

export default function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { token } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    fetchMembers();
  }, [token]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        setError('Failed to fetch members');
      }
    } catch (error) {
      setError('Error fetching members');
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (memberData: Omit<Member, 'id'> | Member) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        const newMember = await response.json();
        setMembers([...members, newMember]);
        setShowForm(false);
        setEditingMember(null);
      } else {
        setError('Failed to add member');
      }
    } catch (error) {
      setError('Error adding member');
    }
  };

  const editMember = async (memberId: number, memberData: Omit<Member, 'id'> | Member) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/${memberId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        const updatedMember = await response.json();
        setMembers(members.map(member => member.id === memberId ? updatedMember : member));
        setShowForm(false);
        setEditingMember(null);
      } else {
        setError('Failed to update member');
      }
    } catch (error) {
      setError('Error updating member');
    }
  };

  const deleteMember = async (memberId: number) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/${memberId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        setMembers(members.filter(member => member.id !== memberId));
      } else {
        setError('Failed to delete member');
      }
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
    return <div>Loading members...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">Member Management</div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-flat-gold hover:bg-flat-gold-hover text-white px-4 py-2 rounded-md"
        >
          Add Member
        </button>
      </div>

      {showForm ? (
        <MemberForm
          member={editingMember}
          onSubmit={editingMember ? (data) => editMember(editingMember.id, data) : addMember}
          onCancel={handleCancel}
        />
      ) : (
        <MemberList
          members={members}
          onEdit={handleEdit}
          onDelete={deleteMember}
        />
      )}
    </div>
  );
} 
