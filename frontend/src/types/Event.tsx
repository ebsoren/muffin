export type EventType = 'recruiting' | 'club' | 'featured'

export interface ClubEvent {
    id: number
    title: string | null
    image: string | null
    description: string | null
    date: string | null
    location: string | null
    event_type: EventType
  }