import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description?: string
    action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                <Icon size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{title}</h3>
            {description && <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">{description}</p>}
            {action}
        </div>
    )
}
