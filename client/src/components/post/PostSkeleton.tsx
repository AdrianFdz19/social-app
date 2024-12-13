// PostSkeleton.tsx

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function PostSkeleton() {
  return (
    <Stack spacing={1}
        style={{marginBottom: '1rem'}}
    >
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

      {/* For other variants, adjust the size with `width` and `height` */}
      <Skeleton variant="circular" width={'3rem'} height={'3rem'} />
      <Skeleton variant="rounded" width={'100%'} height={'15rem'} />
    </Stack>
  );
}
