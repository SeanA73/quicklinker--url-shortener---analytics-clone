
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  customAlias?: string;
  clicks: number;
  createdAt: string;
}

interface ShortenUrlResult {
  shortUrl: string;
  id: string;
}

export function useUrlShortener() {
  const queryClient = useQueryClient();

  const shortenMutation = useMutation({
    mutationFn: async ({ url, customAlias }: { url: string; customAlias?: string }): Promise<ShortenUrlResult> => {
      // Mock API call - in real app, this would call your backend
      const id = Date.now().toString();
      const shortCode = customAlias || generateShortCode();
      const shortUrl = `https://short.ly/${shortCode}`;

      const newLink: ShortenedUrl = {
        id,
        originalUrl: url,
        shortUrl,
        customAlias,
        clicks: 0,
        createdAt: new Date().toISOString(),
      };

      // Store in AsyncStorage
      const existingLinks = await getStoredLinks();
      const updatedLinks = [newLink, ...existingLinks];
      await AsyncStorage.setItem("shortened_urls", JSON.stringify(updatedLinks));

      return { shortUrl, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortened-urls"] });
    },
  });

  const shortenUrl = async (url: string, customAlias?: string): Promise<ShortenUrlResult> => {
    return shortenMutation.mutateAsync({ url, customAlias });
  };

  return {
    shortenUrl,
    isLoading: shortenMutation.isPending,
  };
}

export function useRecentLinks() {
  return useQuery({
    queryKey: ["shortened-urls"],
    queryFn: getStoredLinks,
  });
}

async function getStoredLinks(): Promise<ShortenedUrl[]> {
  try {
    const stored = await AsyncStorage.getItem("shortened_urls");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load stored links:", error);
    return [];
  }
}

function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}