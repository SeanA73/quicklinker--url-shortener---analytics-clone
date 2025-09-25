import { useQuery } from "@tanstack/react-query";

interface AnalyticsData {
  totalClicks: number;
  totalLinks: number;
  topLinks: {
    shortUrl: string;
    originalUrl: string;
    clicks: number;
  }[];
  clicksByDay: {
    date: string;
    clicks: number;
  }[];
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async (): Promise<AnalyticsData> => {
      // Mock analytics data - in real app, this would call your API
      return {
        totalClicks: 1247,
        totalLinks: 23,
        topLinks: [
          {
            shortUrl: "https://short.ly/abc123",
            originalUrl: "https://example.com/very-long-url-that-needs-shortening",
            clicks: 456,
          },
          {
            shortUrl: "https://short.ly/def456",
            originalUrl: "https://another-example.com/another-long-url",
            clicks: 234,
          },
          {
            shortUrl: "https://short.ly/ghi789",
            originalUrl: "https://third-example.com/yet-another-url",
            clicks: 123,
          },
        ],
        clicksByDay: [
          { date: "2024-01-01", clicks: 45 },
          { date: "2024-01-02", clicks: 67 },
          { date: "2024-01-03", clicks: 89 },
          { date: "2024-01-04", clicks: 123 },
          { date: "2024-01-05", clicks: 156 },
          { date: "2024-01-06", clicks: 178 },
          { date: "2024-01-07", clicks: 201 },
        ],
      };
    },
  });
}