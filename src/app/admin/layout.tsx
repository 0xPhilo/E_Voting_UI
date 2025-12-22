import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin - e-Voting',
    description: 'Admin panel untuk e-Voting Kampus',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
