/**
 * Inicio dashboard fixture.
 *
 * Shapes mirror what the real API is expected to return, so replacing the
 * source in `useDashboardData` will not force any component change.
 * Icon fields are string keys, not components: data stays serializable.
 */
export const inicioMock = {
  user: {
    name: 'Laura Rodríguez',
    initials: 'LR',
  },

  balance: {
    total: 61.9,
    owedToYou: 86.4,
    youOwe: 24.5,
  },

  monthSpend: {
    total: 248.7,
    deltaPct: 12.4,
    sharePct: 60,
    compareLabel: 'mayo',
  },

  groups: [
    {
      id: 'piso-centro',
      name: 'Piso Centro',
      icon: 'home',
      memberCount: 4,
      lastActivity: 'Ayer',
      balance: 42.8,
    },
    {
      id: 'viaje-lisboa',
      name: 'Viaje Lisboa',
      icon: 'plane',
      memberCount: 3,
      lastActivity: 'Hace 3 días',
      balance: 19.1,
    },
  ],

  activity: [
    {
      id: 'act-1',
      title: 'Ana pagó la cena',
      detail: 'Ana · Tu parte 18,50 €',
      groupName: 'Piso Centro',
      dateLabel: 'Hoy, 20:14',
      amount: 32.5,
      status: 'favorable',
      icon: 'utensils',
    },
    {
      id: 'act-2',
      title: 'Entradas concierto',
      detail: 'Laura · Tu parte 24,50 €',
      groupName: 'Viaje Lisboa',
      dateLabel: '16 jun',
      amount: 24.5,
      status: 'pending',
      icon: 'ticket',
    },
    {
      id: 'act-3',
      title: 'Compra semanal',
      detail: 'Marcos · Tu parte 17,10 €',
      groupName: 'Piso Centro',
      dateLabel: '15 jun',
      amount: 29.4,
      status: 'favorable',
      icon: 'cart',
    },
  ],

  settlements: [
    {
      id: 'set-1',
      counterpart: 'Ana',
      groupName: 'Piso Centro',
      amount: 21.4,
    },
    {
      id: 'set-2',
      counterpart: 'Marcos',
      groupName: 'Piso Centro',
      amount: 21.4,
    },
  ],
}
