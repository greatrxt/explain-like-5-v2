"use client";

import { isToday, isYesterday, subWeeks, subMonths } from "date-fns";
import { Info, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/utils";

interface ChatSummary {
  id: string;
  title: string;
  createdAt: string;
}

type GroupedChats = {
  today: ChatSummary[];
  yesterday: ChatSummary[];
  lastWeek: ChatSummary[];
  lastMonth: ChatSummary[];
  older: ChatSummary[];
};

function groupChatsByDate(chats: ChatSummary[]): GroupedChats {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  return chats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.createdAt);
      if (isToday(chatDate)) groups.today.push(chat);
      else if (isYesterday(chatDate)) groups.yesterday.push(chat);
      else if (chatDate > oneWeekAgo) groups.lastWeek.push(chat);
      else if (chatDate > oneMonthAgo) groups.lastMonth.push(chat);
      else groups.older.push(chat);
      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats
  );
}

function ChatItem({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  chat: ChatSummary;
  isActive: boolean;
  onDelete: (id: string) => void;
  setOpenMobile: (open: boolean) => void;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
          <span className="truncate">{chat.title}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu modal>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            className="mr-0.5 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            showOnHover={!isActive}
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive"
            onSelect={() => onDelete(chat.id)}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function ChatGroup({
  label,
  chats,
  activeId,
  onDelete,
  setOpenMobile,
}: {
  label: string;
  chats: ChatSummary[];
  activeId: string | undefined;
  onDelete: (id: string) => void;
  setOpenMobile: (open: boolean) => void;
}) {
  if (chats.length === 0) return null;
  return (
    <>
      <SidebarGroupLabel className="mt-4 first:mt-0 text-xs text-sidebar-foreground/50">
        {label}
      </SidebarGroupLabel>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeId}
          onDelete={onDelete}
          setOpenMobile={setOpenMobile}
        />
      ))}
    </>
  );
}

export function SidebarHistory({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const {
    data: history,
    isLoading,
    mutate,
  } = useSWR<ChatSummary[]>(
    user ? "/api/history" : null,
    (url: string) => fetcher(url) as Promise<ChatSummary[]>,
    { fallbackData: [] }
  );

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Deleting chat...",
      success: () => {
        mutate((prev) => prev?.filter((c) => c.id !== deleteId));
        return "Chat deleted";
      },
      error: "Failed to delete chat",
    });

    setShowDeleteDialog(false);
    if (deleteId === id) router.push("/");
  };

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <Info className="size-4" />
            <p>Sign in to save and revisit your chats</p>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex flex-col gap-2 p-2">
            {[44, 32, 28, 64, 52].map((w) => (
              <Skeleton
                key={w}
                className="h-7 rounded-md"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (!history || history.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <Info className="size-4" />
            <p>No chats yet. Start a conversation!</p>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const grouped = groupChatsByDate(history);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <ChatGroup label="Today" chats={grouped.today} activeId={id as string} onDelete={(id) => { setDeleteId(id); setShowDeleteDialog(true); }} setOpenMobile={setOpenMobile} />
            <ChatGroup label="Yesterday" chats={grouped.yesterday} activeId={id as string} onDelete={(id) => { setDeleteId(id); setShowDeleteDialog(true); }} setOpenMobile={setOpenMobile} />
            <ChatGroup label="Last 7 days" chats={grouped.lastWeek} activeId={id as string} onDelete={(id) => { setDeleteId(id); setShowDeleteDialog(true); }} setOpenMobile={setOpenMobile} />
            <ChatGroup label="Last 30 days" chats={grouped.lastMonth} activeId={id as string} onDelete={(id) => { setDeleteId(id); setShowDeleteDialog(true); }} setOpenMobile={setOpenMobile} />
            <ChatGroup label="Older" chats={grouped.older} activeId={id as string} onDelete={(id) => { setDeleteId(id); setShowDeleteDialog(true); }} setOpenMobile={setOpenMobile} />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
