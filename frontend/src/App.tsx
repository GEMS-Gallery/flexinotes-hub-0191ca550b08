import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { backend } from 'declarations/backend';

interface Tab {
  id: number;
  title: string;
  content: EditorState;
  position: { x: number; y: number };
}

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTab, setDraggedTab] = useState<number | null>(null);

  useEffect(() => {
    fetchTabs();
  }, []);

  const fetchTabs = async () => {
    try {
      const fetchedTabs = await backend.getTabs();
      setTabs(fetchedTabs.map(tab => ({
        id: tab.id,
        title: tab.title,
        content: tab.content ? EditorState.createWithContent(convertFromRaw(JSON.parse(tab.content))) : EditorState.createEmpty(),
        position: { x: Math.random() * 500, y: Math.random() * 300 }
      })));
    } catch (error) {
      console.error('Error fetching tabs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTab = async (type: string) => {
    setLoading(true);
    try {
      const result = await backend.createTab(type, null);
      if ('ok' in result) {
        const newTab: Tab = {
          id: result.ok,
          title: type,
          content: EditorState.createEmpty(),
          position: { x: Math.random() * 500, y: Math.random() * 300 }
        };
        setTabs([...tabs, newTab]);
      }
    } catch (error) {
      console.error('Error creating tab:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTab = async (id: number, content: EditorState) => {
    try {
      const contentString = JSON.stringify(convertToRaw(content.getCurrentContent()));
      await backend.updateTab(id, tabs.find(tab => tab.id === id)?.title || '', contentString);
    } catch (error) {
      console.error('Error updating tab:', error);
    }
  };

  const deleteTab = async (id: number) => {
    setLoading(true);
    try {
      await backend.deleteTab(id);
      setTabs(tabs.filter(tab => tab.id !== id));
    } catch (error) {
      console.error('Error deleting tab:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (id: number) => (e: React.MouseEvent) => {
    setDraggedTab(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedTab !== null) {
      setTabs(tabs.map(tab => 
        tab.id === draggedTab 
          ? { ...tab, position: { x: e.clientX, y: e.clientY } }
          : tab
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedTab(null);
  };

  return (
    <Box sx={{ height: '100vh', p: 2, bgcolor: 'background.default' }} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <Box sx={{ mb: 2 }}>
        <Button onClick={() => createTab('Document')} sx={{ mr: 1 }}>Add Document</Button>
        <Button onClick={() => createTab('Note')}>Add Note</Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        tabs.map(tab => (
          <Box
            key={tab.id}
            sx={{
              position: 'absolute',
              left: tab.position.x,
              top: tab.position.y,
              width: 300,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 3,
              overflow: 'hidden'
            }}
          >
            <Box
              onMouseDown={handleMouseDown(tab.id)}
              sx={{ p: 1, cursor: 'move', bgcolor: 'primary.main' }}
            >
              {tab.title}
              <Button onClick={() => deleteTab(tab.id)} sx={{ float: 'right', p: 0, minWidth: 'auto' }}>X</Button>
            </Box>
            <Editor
              editorState={tab.content}
              onEditorStateChange={(newState) => {
                const updatedTabs = tabs.map(t => t.id === tab.id ? { ...t, content: newState } : t);
                setTabs(updatedTabs);
                updateTab(tab.id, newState);
              }}
            />
          </Box>
        ))
      )}
    </Box>
  );
};

export default App;
