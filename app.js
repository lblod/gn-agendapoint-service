import { app, errorHandler } from 'mu';
import { getEditorDocument, createEditorDocument } from './util/queries'
import { processContent } from './util/contentProcessing'


app.post('/:agendapointUuid/copy', (req, res) => {
  const uuid = req.params.agendapointUuid;
  const editorDocument = getEditorDocument(uuid);
  const processedContent = processContent(editorDocument.content);
  const finalTitle = `Copy of ${editorDocument.title}`;
  const uuidOfNewDocument = createEditorDocument(finalTitle, processedContent)
  res.json({uuid: uuidOfNewDocument});
})