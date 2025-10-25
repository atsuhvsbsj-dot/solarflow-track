import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export function useRealtimeSubscription(
  table: string,
  callback: () => void,
  filter?: { column: string; value: string }
) {
  useEffect(() => {
    let channel: RealtimeChannel;

    if (filter) {
      channel = supabase
        .channel(`${table}-changes-${filter.value}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table,
            filter: `${filter.column}=eq.${filter.value}`,
          },
          () => {
            callback();
          }
        )
        .subscribe();
    } else {
      channel = supabase
        .channel(`${table}-changes`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table,
          },
          () => {
            callback();
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, filter]);
}

export function useCustomerUpdates(customerId: string, callback: () => void) {
  useRealtimeSubscription("customers", callback, {
    column: "id",
    value: customerId,
  });
}

export function useDocumentUpdates(customerId: string, callback: () => void) {
  useRealtimeSubscription("documents", callback, {
    column: "customer_id",
    value: customerId,
  });
}

export function useChecklistUpdates(customerId: string, callback: () => void) {
  useRealtimeSubscription("checklists", callback, {
    column: "customer_id",
    value: customerId,
  });
}

export function useActivityLogUpdates(callback: () => void) {
  useRealtimeSubscription("activity_logs", callback);
}
