import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "payment_pending"
  | "settled";

export type Transaction = {
  id: string;
  debtor: string;
  creditor: string;
  amountInPence: number;
  description: string;
  createdAt: string;
  status: TransactionStatus;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  members: string[];
  transactions: Transaction[];
};

type EventContextType = {
  events: Event[];
  currentUser: string;

  setCurrentUser: (
    memberName: string
  ) => void;

  createEvent: (
    name: string,
    description: string,
    members: string[]
  ) => Event;

  addMember: (
    eventId: string,
    memberName: string
  ) => void;

  createTransaction: (
    eventId: string,
    creditor: string,
    amountInPence: number,
    description: string
  ) => void;

  confirmTransaction: (
    eventId: string,
    transactionId: string
  ) => void;

  rejectTransaction: (
    eventId: string,
    transactionId: string
  ) => void;

  markTransactionPaid: (
    eventId: string,
    transactionId: string
  ) => void;

  confirmSettlement: (
    eventId: string,
    transactionId: string
  ) => void;

  rejectSettlement: (
    eventId: string,
    transactionId: string
  ) => void;

  deleteEvent: (
    eventId: string
  ) => void;
};

const EventContext =
  createContext<EventContextType | undefined>(
    undefined
  );

export function EventProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [events, setEvents] = useState<Event[]>([]);

  const [currentUser, setCurrentUser] =
    useState("Ben");

  function createEvent(
    name: string,
    description: string,
    members: string[]
  ) {
    const eventMembers = members.includes(
      currentUser
    )
      ? members
      : [currentUser, ...members];

    const newEvent: Event = {
      id: Date.now().toString(),
      name,
      description,
      members: eventMembers,
      transactions: [],
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
      currentEvents.map((event) => {
        if (event.id !== eventId) {
          return event;
        }

        if (
          event.members.includes(memberName)
        ) {
          return event;
        }

        return {
          ...event,
          members: [
            ...event.members,
            memberName,
          ],
        };
      })
    );
  }

  function createTransaction(
    eventId: string,
    creditor: string,
    amountInPence: number,
    description: string
  ) {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      debtor: currentUser,
      creditor,
      amountInPence,
      description,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              transactions: [
                ...event.transactions,
                newTransaction,
              ],
            }
          : event
      )
    );
  }

  function updateTransactionStatus(
    eventId: string,
    transactionId: string,
    status: TransactionStatus
  ) {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              transactions:
                event.transactions.map(
                  (transaction) =>
                    transaction.id ===
                    transactionId
                      ? {
                          ...transaction,
                          status,
                        }
                      : transaction
                ),
            }
          : event
      )
    );
  }

  function confirmTransaction(
    eventId: string,
    transactionId: string
  ) {
    updateTransactionStatus(
      eventId,
      transactionId,
      "confirmed"
    );
  }

  function rejectTransaction(
    eventId: string,
    transactionId: string
  ) {
    updateTransactionStatus(
      eventId,
      transactionId,
      "rejected"
    );
  }

  function markTransactionPaid(
    eventId: string,
    transactionId: string
  ) {
    updateTransactionStatus(
      eventId,
      transactionId,
      "payment_pending"
    );
  }

  function confirmSettlement(
    eventId: string,
    transactionId: string
  ) {
    updateTransactionStatus(
      eventId,
      transactionId,
      "settled"
    );
  }

  function rejectSettlement(
    eventId: string,
    transactionId: string
  ) {
    updateTransactionStatus(
      eventId,
      transactionId,
      "confirmed"
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
        currentUser,
        setCurrentUser,
        createEvent,
        addMember,
        createTransaction,
        confirmTransaction,
        rejectTransaction,
        markTransactionPaid,
        confirmSettlement,
        rejectSettlement,
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