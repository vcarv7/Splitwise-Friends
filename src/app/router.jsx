import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout.jsx'
import ErrorPage from './ErrorPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import InicioPage from '@/features/dashboard/pages/InicioPage.jsx'
import ActividadPage from '@/features/actividad/pages/ActividadPage.jsx'
import GruposPage from '@/features/grupos/pages/GruposPage.jsx'
import PerfilPage from '@/features/perfil/pages/PerfilPage.jsx'
import AjustesPage from '@/features/ajustes/pages/AjustesPage.jsx'
import NuevoGastoPage from '@/features/gastos/pages/NuevoGastoPage.jsx'
import LiquidarPage from '@/features/liquidaciones/pages/LiquidarPage.jsx'

// `handle.title` feeds the Header directly through useMatches(), so a new page
// only needs its title declared here instead of being hardcoded in the layout.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <InicioPage />, handle: { title: 'Inicio' } },
      { path: 'actividad', element: <ActividadPage />, handle: { title: 'Actividad' } },
      { path: 'grupos', element: <GruposPage />, handle: { title: 'Grupos' } },
      { path: 'perfil', element: <PerfilPage />, handle: { title: 'Perfil' } },
      { path: 'ajustes', element: <AjustesPage />, handle: { title: 'Ajustes' } },
      { path: 'nuevo-gasto', element: <NuevoGastoPage />, handle: { title: 'Nuevo gasto' } },
      { path: 'liquidar', element: <LiquidarPage />, handle: { title: 'Liquidar saldos' } },
      { path: '*', element: <NotFoundPage />, handle: { title: 'Página no encontrada' } },
    ],
  },
])
