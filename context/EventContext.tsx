import { createContext, ReactNode, useContext, useState } from "react";

export type Event = {
  id: string;
  name: string;
  description: string;
  members: string[];
};

type EventContextType = {
  events: Event[];
  createEvent: (
    name: string,
    description: string,
    members: string[]
  ) => Event;
  addMember: (eventId: string, memberName: string) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  function createEvent(
    name: string,
    description: string,
    members: string[]
  ) {
    const newEvent: Event = {
      id: Date.now().toString(),
      name,
      description,
      members,
    };

    setEvents((currentEvents) => [
      ...currentEvents,
      newEvent,
    ]);

    return newEvent;
  }

  function addMember(eventId: string, memberName: string) {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              members: [...event.members, memberName],
            }
          : event
      )
    );
  }

  return (
    <EventContext.Provider
      value={{
        events,
        createEvent,
        addMember,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error(
      "useEvents must be used inside EventProvider"
    );
  }

  return context;
}