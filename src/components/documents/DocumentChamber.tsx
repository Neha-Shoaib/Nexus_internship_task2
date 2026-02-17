import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

type DocumentStatus = 'draft' | 'in_review' | 'signed';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  status: DocumentStatus;
  url?: string;
}

export const DocumentChamber: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Investment Agreement.pdf',
      type: 'application/pdf',
      size: '2.4 MB',
      lastModified: '2024-01-15',
      status: 'draft',
    },
    {
      id: '2',
      name: 'NDA Contract.pdf',
      type: 'application/pdf',
      size: '1.1 MB',
      lastModified: '2024-01-14',
      status: 'in_review',
    },
    {
      id: '3',
      name: 'Partnership Deed.pdf',
      type: 'application/pdf',
      size: '3.2 MB',
      lastModified: '2024-01-10',
      status: 'signed',
    },
  ]);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signature, setSignature] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return 'gray';
      case 'in_review':
        return 'yellow';
      case 'signed':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'in_review':
        return 'In Review';
      case 'signed':
        return 'Signed';
      default:
        return status;
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach((file) => {
        const newDoc: Document = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          lastModified: new Date().toISOString().split('T')[0],
          status: 'draft',
          url: URL.createObjectURL(file),
        };
        setDocuments((prev) => [...prev, newDoc]);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleStatusChange = (docId: string, newStatus: DocumentStatus) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, status: newStatus } : doc
      )
    );
    if (selectedDocument?.id === docId) {
      setSelectedDocument((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignature(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  const saveSignature = () => {
    if (selectedDocument) {
      handleStatusChange(selectedDocument.id, 'signed');
      setShowSignaturePad(false);
      setSignature('');
      alert('Document signed successfully!');
    }
  };

  const deleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    if (selectedDocument?.id === docId) {
      setSelectedDocument(null);
      setShowPreview(false);
      setPreviewUrl(null);
    }
  };

  const handlePreview = (doc: Document) => {
    if (doc.url) {
      setPreviewUrl(doc.url);
      setShowPreview(true);
      setPreviewLoading(true);
    } else {
      // For demo documents without URL, show alert
      alert('Preview not available for this document. Please upload a new document to preview it.');
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewUrl(null);
  };

  const getFileType = (type: string): 'pdf' | 'image' | 'document' | 'unknown' => {
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('image')) return 'image';
    if (type.includes('word') || type.includes('document')) return 'document';
    return 'unknown';
  };

  return (
    <div className="flex gap-6">
      {/* Document List */}
      <Card className="w-1/3 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Documents</h2>
          <label className="cursor-pointer">
            <Button size="sm" className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Upload
            </Button>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              multiple
            />
          </label>
        </div>

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <svg
            className="w-8 h-8 mx-auto text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-gray-500">
            Drag & drop files here
          </p>
        </div>

        {/* Document List */}
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedDocument?.id === doc.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
                    <path d="M8 12h8v2H8zm0 4h8v2H8z" />
                  </svg>
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.size} • {doc.lastModified}
                    </p>
                  </div>
                </div>
                <Badge color={getStatusColor(doc.status)}>
                  {getStatusLabel(doc.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Document Preview / Details */}
      <Card className="flex-1 p-4">
        {selectedDocument ? (
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedDocument.name}</h2>
                <p className="text-sm text-gray-500">
                  {selectedDocument.size} • Last modified: {selectedDocument.lastModified}
                </p>
              </div>
              <Badge color={getStatusColor(selectedDocument.status)} size="lg">
                {getStatusLabel(selectedDocument.status)}
              </Badge>
            </div>

            {/* Status Actions */}
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                variant={selectedDocument.status === 'draft' ? 'primary' : 'outline'}
                onClick={() => handleStatusChange(selectedDocument.id, 'draft')}
              >
                Mark as Draft
              </Button>
              <Button
                size="sm"
                variant={selectedDocument.status === 'in_review' ? 'primary' : 'outline'}
                onClick={() => handleStatusChange(selectedDocument.id, 'in_review')}
              >
                Send for Review
              </Button>
              <Button
                size="sm"
                variant={selectedDocument.status === 'signed' ? 'primary' : 'outline'}
                onClick={() => handleStatusChange(selectedDocument.id, 'signed')}
                disabled={selectedDocument.status === 'signed'}
              >
                Mark as Signed
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePreview(selectedDocument)}
                className="ml-auto"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </Button>
            </div>

            {/* Document Preview Placeholder */}
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-4">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-2 text-gray-500">Document Preview</p>
                <p className="text-sm text-gray-400">
                  PDF preview would be displayed here
                </p>
              </div>
            </div>

            {/* E-Signature Section */}
            {selectedDocument.status !== 'signed' && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">E-Signature</h3>
                  {!showSignaturePad && (
                    <Button
                      size="sm"
                      onClick={() => setShowSignaturePad(true)}
                    >
                      Add Signature
                    </Button>
                  )}
                </div>

                {showSignaturePad && (
                  <div>
                    <div className="border-2 border-gray-300 rounded-lg bg-white mb-2">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={150}
                        className="w-full cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={clearSignature}>
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        onClick={saveSignature}
                        disabled={!signature}
                      >
                        Sign Document
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowSignaturePad(false);
                          clearSignature();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {signature && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Your signature:</p>
                    <img
                      src={signature}
                      alt="Signature"
                      className="border border-gray-200 rounded p-2 bg-white max-w-xs"
                    />
                  </div>
                )}
              </div>
            )}

            {selectedDocument.status === 'signed' && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-green-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">
                    Document has been signed
                  </span>
                </div>
              </div>
            )}

            {/* Delete Button */}
            <div className="border-t pt-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => deleteDocument(selectedDocument.id)}
              >
                Delete Document
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2">Select a document to view details</p>
            </div>
          </div>
        )}
      </Card>

      {/* Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closePreview}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedDocument?.name}</h3>
              <button
                onClick={closePreview}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden">
              {previewLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {selectedDocument && getFileType(selectedDocument.type) === 'pdf' && (
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                  onLoad={() => setPreviewLoading(false)}
                />
              )}
              
              {selectedDocument && getFileType(selectedDocument.type) === 'image' && (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
                  <img
                    src={previewUrl}
                    alt={selectedDocument.name}
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => setPreviewLoading(false)}
                  />
                </div>
              )}
              
              {selectedDocument && getFileType(selectedDocument.type) === 'document' && (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-4 text-gray-600 font-medium">Word Document</p>
                    <p className="text-sm text-gray-500 mt-2">Preview not available for Word documents</p>
                    <a
                      href={previewUrl}
                      download={selectedDocument.name}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download to View
                    </a>
                  </div>
                </div>
              )}
              
              {selectedDocument && getFileType(selectedDocument.type) === 'unknown' && (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-gray-600 font-medium">Preview Not Available</p>
                    <p className="text-sm text-gray-500 mt-2">This file type cannot be previewed</p>
                    <a
                      href={previewUrl}
                      download={selectedDocument.name}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download File
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
              <a
                href={previewUrl}
                download={selectedDocument?.name}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
              <Button variant="outline" onClick={closePreview}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
