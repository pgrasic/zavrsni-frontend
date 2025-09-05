import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getCurrentUser } from '../../utils/api';
import { Box, HStack, Link, Spacer } from '@chakra-ui/react';

const Header: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const user: any = await getCurrentUser();
        if (!mounted) return;
        setIsAdmin(Boolean((user as any).is_admin));
      } catch (e) {
        // ignore
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  return (
    <Box as="header" bgGradient="linear(to-r, teal.400, teal.300)" color="white" boxShadow="sm" py={4} mb={6} position="relative">
      <HStack spacing={6} px={6} align="center" justify="flex-start" w="100%">
        <Link as={RouterLink} to="/medication" fontWeight={700} color="white">Dodaj podsjetnik</Link>
        <Link as={RouterLink} to="/reminders" fontWeight={700} color="white">Moji podsjetnici</Link>
        {isAdmin && <Link as={RouterLink} to="/admin" fontWeight={700} color="white">Administracija</Link>}
      </HStack>
    </Box>
  );
};

export default Header;
