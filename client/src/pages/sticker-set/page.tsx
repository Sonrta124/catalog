import { FC, useEffect } from 'react';
import { BackButton } from '@twa-dev/sdk/react';
import { useStoreMap, useUnit } from 'effector-react';

import styles from './sticker-set.module.scss';

import { routes } from '@/app/router';
import { getStickerSetByName } from '@/entities/sticker-set/api';
import { StickerSetFullSkeleton } from '@/shared/ui/sticker-set/skeleton/sticker-set-full';
import { $stickerSets } from '@/entities/sticker-set/model';
import { StickerSetFull } from '@/features/sticker-set/sticker-set-full';
import { SelectedSticker } from '@/features/sticker-select';
import { scrollToTop } from '@/shared/hooks';
import { ListRecommendationsWidget } from '@/widgets/catalog-list/ui/recommendations';
import { ListRecommendationsDivider } from '@/features/recommendations/sticker-page';
import { $isModerator } from '@/shared/session';


export const StickerSetPage: FC = () => {
  scrollToTop();
  const isModerator = useUnit($isModerator);
  const isLoading = useUnit(getStickerSetByName.pending);

  const { stickerSetName } = useUnit(routes.stickerSet.$params);

  const stickerSet = useStoreMap({
    store: $stickerSets,
    keys: [stickerSetName],
    fn: (stickerSets, [stickerSetName]) => {
      return stickerSets.find(({ name }) => name.toLowerCase() === stickerSetName?.toLowerCase()) || null;
    },
  });

  useEffect(() => {
    if (!stickerSet && !isLoading) {
      getStickerSetByName(stickerSetName);
    }
  }, [stickerSetName, stickerSet]);

  return (
    <div>
      <BackButton onClick={() => window.history.length > 0 ? window.history.back() : routes.root.open()} />
      <SelectedSticker/>

      <div className={styles.StickerSet}>
        {
          stickerSet
            ? <StickerSetFull stickerSet={stickerSet} isModerator={isModerator}/>
            : <StickerSetFullSkeleton />
        }
      </div>

      <ListRecommendationsDivider/>

      {
        stickerSet && <ListRecommendationsWidget stickerSet={stickerSet}/>
      }
    </div>
  );
};