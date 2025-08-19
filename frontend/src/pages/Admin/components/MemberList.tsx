import type { Member } from "../../../api/types";
import { getProfileImageUrl } from "../../../utils/supabase";


interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

export default function MemberList({ members, onEdit, onDelete }: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No members found. Add your first member to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold text-custom-black dark:text-white mb-4">
        Current Members ({members.length})
      </div>

      <div className="grid gap-4">
        {members.map((member) => {
          const imageUrl = getProfileImageUrl(member.image);

          return (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl || '/default-avatar.svg'}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-custom-black dark:text-white">
                      {member.name}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      {member.title ? (
                        <span className="text-gray-500 dark:text-gray-400">
                          {member.title}
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          No Title
                        </span>
                      )}
                      {member.board && (
                        <span className="bg-flat-gold text-white px-2 py-1 rounded text-xs">
                          Board
                        </span>
                      )}
                    </div>
                    {member.linkedIn && (
                      <a
                        href={member.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(member)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(member.id ?? "")}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 