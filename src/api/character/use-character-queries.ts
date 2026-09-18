import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import {
  getApiCharacterOptions,
  getApiCharacterAppearanceOptionsOptions,
  getApiCharacterProfileOptions,
  getApiWalletOptions,
} from "../generated/@tanstack/react-query.gen.ts";

/** The one character and wallet, shared by every course. */
export function useCharacterQuery() {
  return useQuery(getApiCharacterOptions({ client: useApiClient() }));
}

export function useCharacterProfileQuery() {
  return useQuery(getApiCharacterProfileOptions({ client: useApiClient() }));
}

export function useAppearanceOptionsQuery() {
  return useQuery(getApiCharacterAppearanceOptionsOptions({ client: useApiClient() }));
}

export function useWalletQuery() {
  return useQuery(getApiWalletOptions({ client: useApiClient() }));
}
