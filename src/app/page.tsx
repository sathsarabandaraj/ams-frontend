import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();
  return <>
    <Button variant="ghost" size="lg">
      {t('HomePage.')}
    </Button>
    <ThemeToggle />
  </>
}
