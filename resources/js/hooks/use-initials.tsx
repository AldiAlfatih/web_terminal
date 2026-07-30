export function useInitials() {
    const getInitials = (fullName?: string): string => {
        if (!fullName) return 'A';
        const names = fullName.trim().split(' ').filter(Boolean);

        if (names.length === 0) return 'A';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    };

    return getInitials;
}
