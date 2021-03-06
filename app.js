import { app, errorHandler } from 'mu';
import { getEditorDocument, createEditorDocument } from './util/queries'
import { processContent } from './util/contentProcessing'


app.post('/:agendapointUuid/copy', async (req, res) => {
  const uuid = req.params.agendapointUuid;
  const editorDocument = await getEditorDocument(uuid);
  const processedContent = processContent(editorDocument.content);
  const finalTitle = `Kopie van ${editorDocument.title}`;
  const uuidOfNewDocument = await createEditorDocument(finalTitle, processedContent, editorDocument.uri);
  res.json({uuid: uuidOfNewDocument});
})