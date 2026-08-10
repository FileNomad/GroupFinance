import { createContext, ReactNode, useContext, useState } from "react";

export type Expense = {
  id: string;
  paidBy: string;
  paidFor: string;
  amountInPence: number;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  members: string[];
  expenses: Expense[];
};

type EventContextType = {
  events: Event[];

  createEvent: (
    name: string,
    description: string,
    members: string[]
  ) => Event;

  addMember: (
    eventId: string,
    memberName: string
  ) => void;

  addExpense: (
    eventId: string,
    paidBy: string,
    paidFor: string,
    amountInPence: number
  ) => void;

  deleteEvent: (
    eventId: string
  ) => void;
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
      expenses: [],
    };

    setEvents((currentEvents) => [
      ...currentEvents,
      newEvent,
    ]);

    return newEvent;
  }

  function addMember(
    eventId: string,
    memberName: string
  ) {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              members: [
                ...event.members,
                memberName,
              ],
            }
          : event
      )
    );
  }

  function addExpense(
    eventId: string,
    paidBy: string,
    paidFor: string,
    amountInPence: number
  ) {
    const newExpense: Expense = {
      id: Date.now().toString(),
      paidBy,
      paidFor,
      amountInPence,
    };

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              expenses: [
                ...event.expenses,
                newExpense,
              ],
            }
          : event
      )
    );
  }

  function deleteEvent(eventId: string) {
    setEvents((currentEvents) =>
      currentEvents.filter(
        (event) => event.id !== eventId
      )
    );
  }

  return (
    <EventContext.Provider
      value={{
        events,
        createEvent,
        addMember,
        addExpense,
        deleteEvent,
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