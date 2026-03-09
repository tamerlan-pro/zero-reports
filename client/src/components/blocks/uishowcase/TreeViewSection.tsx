import { Paper } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SectionTitle } from './shared';

export function TreeViewSection() {
  return (
    <>
      <SectionTitle>Tree View (MUI X)</SectionTitle>
      <Paper variant="outlined" sx={{ maxWidth: 360, p: 1, mb: 2 }}>
        <SimpleTreeView defaultExpandedItems={['1', '1.1']}>
          <TreeItem itemId="1" label="Reports">
            <TreeItem itemId="1.1" label="Q4 2025">
              <TreeItem itemId="1.1.1" label="Revenue Report" />
              <TreeItem itemId="1.1.2" label="Cost Analysis" />
              <TreeItem itemId="1.1.3" label="Profit Summary" />
            </TreeItem>
            <TreeItem itemId="1.2" label="Q1 2026">
              <TreeItem itemId="1.2.1" label="Revenue Report" />
              <TreeItem itemId="1.2.2" label="Forecast" />
            </TreeItem>
          </TreeItem>
          <TreeItem itemId="2" label="Settings">
            <TreeItem itemId="2.1" label="Theme" />
            <TreeItem itemId="2.2" label="Data Sources" />
          </TreeItem>
          <TreeItem itemId="3" label="Archive" disabled />
        </SimpleTreeView>
      </Paper>
    </>
  );
}
