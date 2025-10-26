import { useEffect, useState } from "react";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "love-recipes-announcements";

const defaultAnnouncements: Announcement[] = [
  {
    id: "sample-1",
    title: "Desafio da semana",
    content:
      "Explore o ritual de 10 minutos focado em reconhecimento mutuo. Ideal para reaproximar depois de um dia corrido.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "Atualizacao do ebook",
    content: "Receitas de reconexao rapida foram aprimoradas com novos prompts de conversa.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const readAnnouncements = (): Announcement[] => {
  if (typeof window === "undefined") return defaultAnnouncements;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return defaultAnnouncements;
    const parsed = JSON.parse(value) as Announcement[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultAnnouncements;
    }
    return parsed;
  } catch (error) {
    console.warn("Nao foi possivel ler anuncios salvos:", error);
    return defaultAnnouncements;
  }
};

const persistAnnouncements = (items: Announcement[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Nao foi possivel guardar anuncios:", error);
  }
};

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);

  useEffect(() => {
    setAnnouncements(readAnnouncements());
  }, []);

  const addAnnouncement = (title: string, content: string) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      throw new Error("Titulo e conteudo sao obrigatorios");
    }

    const cryptoInstance = (globalThis as { crypto?: Crypto }).crypto;
    const uniqueId =
      cryptoInstance && typeof cryptoInstance.randomUUID === "function"
        ? cryptoInstance.randomUUID()
        : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    const newAnnouncement: Announcement = {
      id: `announcement_${uniqueId}`,
      title: trimmedTitle,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };

    setAnnouncements((prev) => {
      const next = [newAnnouncement, ...prev];
      persistAnnouncements(next);
      return next;
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistAnnouncements(next);
      return next.length > 0 ? next : defaultAnnouncements;
    });
  };

  return {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
  };
};
