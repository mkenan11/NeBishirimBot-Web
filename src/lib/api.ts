/** Brauzer tərəfi: bütün sorğular eyni domendəki /api proxy-sinə gedir. */

export type PantryItem = { id: number; name: string };
export type Pantry = { items: PantryItem[] };

export type TextResult = Pantry & {
  added: string[];
  existing: string[];
  unknown: string[];
  skipped: string[];
  invalid: string[];
  corrected: string[];
};

export type Mode = "all" | "owned" | "extra";
export type SearchAction = "more" | "findtime" | "complete";

export type RecipeSummary = { index: number; name: string; minutes: number; method: string; missing: string[] };

export type RecipesState = {
  mode: Mode;
  time_limit: 0 | 45 | 90;
  servings: 1 | 2 | 4;
  page: number;
  pages: number;
  complete: boolean;
  can_more: boolean;
  can_complete: boolean;
  can_findtime: boolean;
  recipes: RecipeSummary[];
};

export type RecipesResponse = { state: RecipesState | null; notice: string | null };

export type RecipeDetail = {
  name: string;
  method: string;
  servings: number;
  prep: number;
  cook: number;
  finish: number;
  total: number;
  ingredients: { name: string; quantity: string }[];
  missing: string[];
  steps: string[];
  note: string;
  video_url: string;
};

export type DetailResponse = { recipe: RecipeDetail; saved: boolean };

export type FavoriteItem = { id: number; name: string; total: number; servings: number; method: string };

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(method: string, path: string, body?: unknown, raw?: Blob): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: raw ? { "Content-Type": raw.type } : body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "offline", "İnternet bağlantısını yoxla və yenidən cəhd et.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code ?? "error",
      data?.message ?? "Nəsə alınmadı. Bir az sonra yenidən cəhd et.",
    );
  }
  return data as T;
}

export const api = {
  pantry: () => request<Pantry>("GET", "/pantry"),
  addText: (text: string) => request<TextResult>("POST", "/pantry/text", { text }),
  addNames: (names: string[]) => request<Pantry & { added: string[]; existing: string[] }>("POST", "/pantry", { names }),
  rename: (id: number, name: string) => request<Pantry>("PATCH", `/pantry/${id}`, { name }),
  remove: (id: number) => request<Pantry & { removed: number }>("DELETE", `/pantry/${id}`),
  clear: () => request<Pantry & { removed: number }>("DELETE", "/pantry"),
  undo: () => request<Pantry>("POST", "/pantry/undo"),

  photo: (image: Blob) =>
    request<{ status: "ok" | "no_food" | "unclear" | "empty"; names: string[] }>("POST", "/photo", undefined, image),

  recipes: () => request<RecipesResponse>("GET", "/recipes"),
  search: () => request<RecipesResponse>("POST", "/recipes/search"),
  mode: (mode: Mode) => request<RecipesResponse>("POST", "/recipes/mode", { mode }),
  preference: (setting: "time_limit" | "servings", value: number) =>
    request<RecipesResponse>("POST", "/recipes/preference", { setting, value }),
  page: (step: 1 | -1) => request<RecipesResponse>("POST", "/recipes/page", { step }),
  more: (action: SearchAction) => request<RecipesResponse>("POST", "/recipes/more", { action }),
  open: (target: RecipeTarget, species?: "beef" | "lamb") =>
    request<DetailResponse>("POST", "/recipes/open", { ...target, species }),
  save: (target: RecipeTarget) => request<{ saved: boolean }>("POST", "/recipes/save", target),

  favorites: (offset = 0) => request<{ total: number; items: FavoriteItem[] }>("GET", `/favorites?offset=${offset}`),
  favorite: (id: number) => request<DetailResponse>("GET", `/favorites/${id}`),
  removeFavorite: (id: number) => request<{ ok: boolean }>("DELETE", `/favorites/${id}`),

  deleteAccount: () => request<{ ok: boolean }>("DELETE", "/account"),
};

export type RecipeTarget = { mode: Mode; page: number; index: number };

/** URL-də resept: /app/recipes/all-0-3 */
export function recipeSlug({ mode, page, index }: RecipeTarget) {
  return `${mode}-${page}-${index}`;
}

export function parseRecipeSlug(slug: string): RecipeTarget | null {
  const match = /^(all|owned|extra)-(\d{1,2})-(\d{1,2})$/.exec(slug);
  return match ? { mode: match[1] as Mode, page: Number(match[2]), index: Number(match[3]) } : null;
}
