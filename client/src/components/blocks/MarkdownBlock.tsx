import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { MarkdownBlock as MarkdownBlockType } from '../../types/report';
import { resolveLocale } from '../../utils/locale';

interface Props {
  block: MarkdownBlockType;
}

export function MarkdownBlock({ block: { content: rawContent } }: Props) {
  const { i18n } = useTranslation();
  const content = resolveLocale(rawContent, i18n.language);
  return (
    <Box
      sx={(theme) => ({
        '& p': { mt: 0, mb: 1.5, lineHeight: 1.7 },
        '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 3, mb: 1 },
        '& ul, & ol': { pl: 3, mb: 1.5 },
        '& li': { mb: 0.5 },
        '& blockquote': {
          borderLeft: '3px solid',
          borderColor: 'primary.main',
          pl: 2,
          ml: 0,
          my: 2,
          color: 'text.secondary',
        },
        '& code': {
          fontFamily: 'monospace',
          backgroundColor: theme.palette.surface.level3,
          px: 0.75,
          py: 0.25,
          borderRadius: `${theme.heroui.radius.small / 2}px`,
          fontSize: theme.heroui.typography.small.fontSize,
        },
        '& pre': {
          backgroundColor: theme.palette.surface.level2,
          p: 2,
          borderRadius: `${theme.heroui.radius.small}px`,
          overflow: 'auto',
          '& code': { backgroundColor: 'transparent', p: 0 },
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          my: 2,
          '& th, & td': {
            border: `1px solid ${theme.palette.surface.level5}`,
            px: 1.5,
            py: 1,
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: theme.palette.surface.level2,
            fontWeight: 600,
          },
        },
        '& hr': {
          border: 'none',
          borderTop: `1px solid ${theme.palette.surface.level4}`,
          my: 3,
        },
        '& img': {
          maxWidth: '100%',
          borderRadius: `${theme.heroui.radius.small}px`,
        },
      })}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        children={content}
        components={{
          p: ({ children }) => (
            <Typography variant="body1" component="p">
              {children}
            </Typography>
          ),
          a: ({ href, children }) => (
            <Link href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </Link>
          ),
          h1: ({ children }) => <Typography variant="h3">{children}</Typography>,
          h2: ({ children }) => <Typography variant="h4">{children}</Typography>,
          h3: ({ children }) => <Typography variant="h5">{children}</Typography>,
        }}
      />
    </Box>
  );
}
