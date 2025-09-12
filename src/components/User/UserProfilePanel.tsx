import React, { useEffect, useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, useToast, Spinner } from '@chakra-ui/react';
import { getUserInfo, updateUserInfo } from '../../utils/api';

const UserProfilePanel: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userId, setUserId] = useState('');

  const toast = useToast();

  useEffect(() => {
    // read current user once on mount to seed the form; getUserInfo returns a Promise
    let mounted = true;
    (async () => {
      try {
        setProfileLoading(true);
        const u = await getUserInfo();
        if (!mounted) return;
        setName(u?.ime || '');
        setSurname(u?.prezime || '');
        setEmail(u?.email || '');
        setUserId(u?.sub || '');
      } catch (err: any) {
        // show toast or ignore; keep form empty
        // eslint-disable-next-line no-console
        console.error('Failed to load user info', err);
      } finally {
        if (mounted) setProfileLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const save = async () => {
    try {
      setLoading(true);
      await updateUserInfo({ ime: name, prezime: surname, email});
      toast({ title: 'Profil spremljen', status: 'success' });
    } catch (e: any) {
      toast({ title: 'Greška', description: e?.message || 'Neuspjeh pri spremanju', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) return <Box p={4}><Spinner /></Box>;

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="white">
      <Heading as="h3" size="md" mb={3}>Vaši podaci</Heading>
      <FormControl mb={3}>
  <FormLabel>Ime</FormLabel>
  <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Prezime</FormLabel>
        <Input value={surname} onChange={(e) => setSurname(e.target.value)} />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Email</FormLabel>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      </FormControl>
      <Button colorScheme="blue" onClick={save} isLoading={loading}>Spremi</Button>
    </Box>
  );
};

export default UserProfilePanel;
