import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSignedInUser } from "@/features/auth";
import { deleteAccount } from "./settings.api";

export function useProfileMutations() {
    const { actions } = useSignedInUser();
    const updateName = useMutation({
        mutationFn: ({
            firstName,
            lastName,
        }: {
            firstName: string;
            lastName: string;
        }) => actions.updateName(firstName, lastName),
    });
    const setPhoto = useMutation({
        mutationFn: (file: File | null) => actions.setPhoto(file),
    });
    return { updateName, setPhoto };
}

export function useSessions() {
    const { actions } = useSignedInUser();
    const queryClient = useQueryClient();
    const sessions = useQuery({
        queryKey: ["sessions"],
        queryFn: actions.listSessions,
    });
    const endSession = useMutation({
        mutationFn: actions.endSession,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["sessions"] }),
    });
    return { sessions, endSession };
}

export function useDeleteAccount() {
    const { actions } = useSignedInUser();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await deleteAccount();
            queryClient.clear();
            await actions.signOut();
        },
    });
}
