import { query, update, uuid, sparqlEscapeUri, sparqlEscapeString } from "mu";

export function getEditorDocument(uuid) {
  const queryResult = await query(`
    ${prefixMap.get("ext").toSparqlString()}
    SELECT * WHERE {
      ?uri a ext:EditorDocument;
        mu:uuid ${uuid};
        ext:editorDocumentContent ?content;
        dct:title ?title;
    }
  `);
  if (queryResult.results.bindings.length === 0) {
    throw new Error(`Editor document with uuid: ${uuid} not found`)
  }
  const queryResultObject = queryResult.results.bindings[0];
  return {
    uri: queryResultObject.uri.value,
    title: queryResultObject.title.value,
    content: queryResultObject.content.value,
  }
}

export function createEditorDocument(title, content) {
  const editorDocumentUuid = uuid();
  const editorDocumentUri = `http://data.lblod.info/id/editor-documents/${editorDocumentUuid}`;
  const documentContainerUuid = uuid();
  const documentContainerUri = `http://data.lblod.info/document-containers/${documentContainerUuid}`;
  const draftStatusUri = `TODO`
  const agendapuntFolderUri = `TODO`
  const queryResult = await update(`
    ${prefixMap.get("ext").toSparqlString()}
    ${prefixMap.get("mu").toSparqlString()}
    ${prefixMap.get("dct").toSparqlString()}
    ${prefixMap.get("pav").toSparqlString()}
    INSERT DATA { {
      ${sparqlEscapeUri(editorDocumentUri)} a ext:EditorDocument;
        mu:uuid ${editorDocumentUuid};
        ext:editorDocumentContent ${sparqlEscapeString(content)};
        dct:title ${sparqlEscapeString(title)};
        pav:createdOn ${sparqlEscapeDateTime(new Date())};
        pav:lastUpdateOn ${sparqlEscapeDateTime(new Date())}.
      ${sparqlEscapeUri(documentContainerUri)} a ext:DocumentContainer;
        pav:hasCurrentVersion ${sparqlEscapeUri(editorDocumentUri)};
        ext:editorDocumentStatus ${sparqlEscapeUri(draftStatusUri)};
        ext:editorDocumentFolder ${sparqlEscapeUri(agendapuntFolderUri)};
        pav:hasVersion ${sparqlEscapeUri(editorDocumentUri)};
    }
  `);
  return documentContainerUri;
}