import { createElement } from 'react'
import { ChevronRight, MoreHorizontal, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import IconBadge from '@/components/ui/IconBadge'
import Money from '@/components/ui/Money'
import { GROUP_ICONS, getIcon } from './icons.jsx'

function GroupRow({ group, onOpen }) {
  // createElement keeps the registry lookup out of JSX so the React Compiler
  // static-components rule does not mistake the resolved icon for a created component.
  const icon = getIcon(GROUP_ICONS, group.icon)

  return (
    <button
      type="button"
      onClick={() => onOpen?.(group)}
      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left"
    >
      <IconBadge tone="brand">{createElement(icon, { size: 18 })}</IconBadge>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{group.name}</p>
        <p className="text-xs text-gray-500 truncate">
          {group.memberCount} personas · {group.lastActivity}
        </p>
      </div>

      <Money
        value={group.balance}
        sign
        tone="auto"
        className="text-sm font-semibold shrink-0"
      />
      <ChevronRight size={16} className="text-gray-400 shrink-0" />
    </button>
  )
}

export default function GroupsOverviewCard({ groups, onOpenGroup, onCreateGroup, onMenu }) {
  return (
    <Card>
      <CardHeader
        title="Tus grupos"
        subtitle={`${groups.length} grupos activos`}
        action={
          <button
            type="button"
            onClick={onMenu}
            aria-label="Más opciones"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreHorizontal size={18} />
          </button>
        }
      />

      <div className="border-t border-gray-100 divide-y divide-gray-100">
        {groups.map((group) => (
          <GroupRow key={group.id} group={group} onOpen={onOpenGroup} />
        ))}
      </div>

      <div className="p-4">
        <Button variant="outline" className="w-full" onClick={onCreateGroup}>
          <Plus size={16} />
          Crear grupo
        </Button>
      </div>
    </Card>
  )
}
