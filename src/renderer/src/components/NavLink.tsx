import { Link, useLocation } from 'react-router-dom'

interface NavLinkProps {
    to: string
    icon: any
    label: string
}

export function NavLink({ to, icon: Icon, label }: NavLinkProps) {
    const location = useLocation()
    const isActive = location.pathname === to

    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${isActive
                    ? 'bg-brand-emerald/10 text-brand-emerald dark:text-brand-emerald'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
        >
            <Icon size={20} />
            {label}
        </Link>
    )
}
