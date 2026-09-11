import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { DocsLayout } from '@/components/DocsLayout';
import { TeamPage } from '@/pages/TeamPage';
import { getRouteByPath, defaultPath, routes } from '@/router/routes';
import { useColorModeValue } from '@/components/ui/color-mode';

export function App() {
  const getInitialPath = (): string => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('team')) {
        return '/team';
      }
      const matched = routes.find((r) => r.path === pathname);
      if (matched) return matched.path;
    }
    return defaultPath;
  };

  const initialPath = getInitialPath();
  const [currentPath, setCurrentPath] = useState<string>(
    initialPath === '/team' ? defaultPath : initialPath,
  );
  const [activeView, setActiveView] = useState<'page' | 'team'>(
    initialPath === '/team' ? 'team' : 'page',
  );

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.includes('team')) {
        setActiveView('team');
      } else {
        setActiveView('page');
        const matched = routes.find((r) => r.path === pathname);
        if (matched) {
          setCurrentPath(matched.path);
        } else {
          setCurrentPath(defaultPath);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    setActiveView('page');
    setCurrentPath(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  const handleSelectTeam = () => {
    setActiveView('team');
    if (window.location.pathname !== '/team') {
      window.history.pushState({}, '', '/team');
    }
  };

  const activeRoute = getRouteByPath(currentPath);
  const PageComponent = activeRoute
    ? activeRoute.component
    : routes[0]!.component;

  const bgApp = useColorModeValue('#F8FAFC', '#0B0F17');
  const textColor = useColorModeValue('#1E293B', '#F8FAFC');

  return (
    <Box minH="100vh" bg={bgApp} color={textColor}>
      <DocsLayout
        currentPath={currentPath}
        onNavigate={handleNavigate}
        activeView={activeView}
        onSelectTeam={handleSelectTeam}
      >
        {activeView === 'team' ? <TeamPage /> : <PageComponent />}
      </DocsLayout>
    </Box>
  );
}
