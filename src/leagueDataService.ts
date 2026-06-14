import { seedStore, Store } from "./data";
import { supabase } from "./supabaseClient";

const tableName = "league_data";
const rowId = "main";

type LeagueDataRow = {
  id: string;
  data: Store;
  updated_at?: string;
};

export async function loadLeagueData(): Promise<Store> {
  const { data, error } = await supabase
    .from(tableName)
    .select("data")
    .eq("id", rowId)
    .maybeSingle<Pick<LeagueDataRow, "data">>();

  if (error) {
    throw error;
  }

  if (data?.data) {
    return data.data;
  }

  await saveLeagueData(seedStore);
  return seedStore;
}

export async function saveLeagueData(store: Store) {
  const { error } = await supabase
    .from(tableName)
    .upsert(
      {
        id: rowId,
        data: store,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    throw error;
  }
}
