'use client'
import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Link from 'next/link';
import BugReport from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import { SecondaryButton } from '@/theme/buttons/Buttons';

const BugReportSection = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
      <Box mt={2} className='center-flex flex-col px-6 py-8 w-full bg-secondary-800' position="relative">
        <IconButton
          aria-label="close"
          onClick={() => setVisible(false)}
          style={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography align='center' variant="body2">
          Aplikace je stále ve vývoji. Možné nápady a nalezené chyby můžeš zaznamenat na tomto linku.
        </Typography>
        <br />
        <Link
          href='https://forms.gle/uU2rXgcin7aDjazk8'
          passHref
          className='center-flex w-32'
        >
          <SecondaryButton className='' variant="outlined" color="secondary">
            Nahlásit problém <BugReport />
          </SecondaryButton>
        </Link>
      </Box>
    );
  }
export default BugReportSection;
