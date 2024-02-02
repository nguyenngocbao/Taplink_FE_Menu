import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import { useEffect } from 'react';

export const useProgress = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  useEffect(() => {
    const onAdd = e => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
        return;
      }

      if (e.target.getAttribute('data-custom-ignore')) return;

      // not a anchor elment
      const anchorEl = e.target.closest('a');
      if (anchorEl === null) return;

      if (anchorEl.getAttribute('data-custom-ignore')) return;

      // same location
      if (
        anchorEl.href === document.location.href ||
        anchorEl.href.split('?')[0] === document.location.href.split('?')[0]
      )
        return;

      NProgress.start();
    };
    document.addEventListener('click', onAdd);
    return () => {
      document.addEventListener('click', onAdd);
    };
  }, []);

  return null;
};
