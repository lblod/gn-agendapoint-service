import { query, update, uuid, sparqlEscapeUri, sparqlEscapeString, sparqlEscapeDateTime } from "mu";
import { prefixMap } from './prefixes'

const CONCEPT_STATUS_URI = "http://mu.semte.ch/application/concepts/a1974d071e6a47b69b85313ebdcef9f7"
const AGENDAPOINT_FOLDER_URI = "http://mu.semte.ch/application/editor-document-folder/ae5feaed-7b70-4533-9417-10fbbc480a4c"

export async function getEditorDocument(uuid) {
  const queryResult = await query(`
    ${prefixMap.get("ext").toSparqlString()}
    ${prefixMap.get("dct").toSparqlString()}
    ${prefixMap.get("mu").toSparqlString()}
    ${prefixMap.get("pav").toSparqlString()}
    SELECT * WHERE {
      ?containerUri a ext:DocumentContainer;
        mu:uuid ${sparqlEscapeString(uuid)};
        pav:hasCurrentVersion ?uri.
      ?uri a ext:EditorDocument;
        ext:editorDocumentContent ?content;
        dct:title ?title.
    }
  `);
  if (queryResult.results.bindings.length === 0) {
    throw new Error(`Editor document with uuid: ${uuid} not found`);
  }
  const queryResultObject = queryResult.results.bindings[0];
  return {
    uri: queryResultObject.uri.value,
    title: queryResultObject.title.value,
    content: queryResultObject.content.value,
  }
}

export async function createEditorDocument(title, content) {
  const editorDocumentUuid = uuid();
  const editorDocumentUri = `http://data.lblod.info/id/editor-documents/${editorDocumentUuid}`;
  const documentContainerUuid = uuid();
  const documentContainerUri = `http://data.lblod.info/document-containers/${documentContainerUuid}`;
  const queryResult = await update(`
    ${prefixMap.get("ext").toSparqlString()}
    ${prefixMap.get("mu").toSparqlString()}
    ${prefixMap.get("dct").toSparqlString()}
    ${prefixMap.get("pav").toSparqlString()}
    INSERT DATA {
      ${sparqlEscapeUri(editorDocumentUri)} a ext:EditorDocument;
        mu:uuid ${sparqlEscapeString(editorDocumentUuid)};
        ext:editorDocumentContent ${sparqlEscapeString(content)};
        dct:title ${sparqlEscapeString(title)};
        pav:createdOn ${sparqlEscapeDateTime(new Date())};
        pav:lastUpdateOn ${sparqlEscapeDateTime(new Date())}.
      ${sparqlEscapeUri(documentContainerUri)} a ext:DocumentContainer;
        mu:uuid ${sparqlEscapeString(documentContainerUuid)};
        pav:hasCurrentVersion ${sparqlEscapeUri(editorDocumentUri)};
        ext:editorDocumentStatus ${sparqlEscapeUri(CONCEPT_STATUS_URI)};
        ext:editorDocumentFolder ${sparqlEscapeUri(AGENDAPOINT_FOLDER_URI)};
        pav:hasVersion ${sparqlEscapeUri(editorDocumentUri)}.
    }
  `);
  return documentContainerUuid;
}