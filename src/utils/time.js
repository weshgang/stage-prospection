import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const distanceFr = (dateIso) =>
  formatDistanceToNow(new Date(dateIso), { addSuffix: true, locale: fr });
