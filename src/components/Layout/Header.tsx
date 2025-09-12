import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../utils/api";
import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../../utils/api';
import "../../assets/css/header.css";

const NavItem: React.FC<{ to: string; label: string; active?: boolean }> = ({
  to,
  label,
  active,
}) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      className={`header__navlink ${active ? "is-active" : ""}`}
    >
      {label}
    </Link>
  );
};

const Header: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const user = getCurrentUser();
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user: any = await getCurrentUser();
        if (!mounted) return;
        setIsAdmin(Boolean(user?.is_admin));
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname.startsWith("/admin");
    return location.pathname === path;
  };

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <Box as="header" className="header">
      <Container maxW="container.lg" className="header__container">
        <Flex align="center" justify="space-between" className="header__bar">
          <Button
            as={RouterLink}
            to={!isAdmin ? `/reminders` : `admin`}
            variant="ghost"
            className="header__brandBtn"
            aria-label="Početna"
          >
            <Box as="span" className="header__brand">
              MedikApp
            </Box>
          </Button>

          <HStack spacing={2} className="header__nav">
            {!isAdmin &&(<NavItem
              to={!isAdmin ? `/medication` : ``}
              label="Dodaj podsjetnik"
              active={isActive("/medication")}
            />)}
            { !isAdmin &&(<NavItem
              to={!isAdmin ? `/reminders` : ``}
              label="Moji podsjetnici"
              active={isActive("/reminders")}
            />)}
            {isAdmin && (
              <NavItem
                to="/admin"
                label="Administracija"
                active={isActive("/admin")}
              />
            )}
            <NavItem
              to={!isAdmin ? `/user` : `admin`}
              label={user?.email}
              active={isActive("/reminders")}
            />
            <>
              <Button
                onClick={onOpen}
                variant="outline"
                size="sm"
                aria-label="Odjava"
              >
                Odjava
              </Button>

              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Odjava
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Jeste li sigurni da se želite odjaviti? Ovu akciju možete
                      poništiti prijavom u aplikaciju ponovno.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Odustani
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          apiLogout();
                          onClose();
                          navigate('/login', { replace: true });
                        }}
                        ml={3}
                      >
                        Odjavi se
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
