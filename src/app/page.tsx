import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();
  return <>
    <Button>{t('HomePage.title')}</Button>
  </>
}
