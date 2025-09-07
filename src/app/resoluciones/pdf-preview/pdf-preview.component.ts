import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-pdf-preview',
    templateUrl: './pdf-preview.component.html',
    styleUrls: ['./pdf-preview.component.css']
})
export class PdfPreviewComponent {
    
    
    private _fileUrl: string | null = null;
    safeUrl: SafeResourceUrl | null = null;
    
    @Output() close = new EventEmitter<void>();
    
    constructor(private sanitizer: DomSanitizer) {}
    
    @Input() set fileUrl(value: string | null) {
        this._fileUrl = value;
        this.safeUrl = value ? this.sanitizer.bypassSecurityTrustResourceUrl(value) : null;
    }
    
    
    
    get fileUrl(): string | null {
        return this._fileUrl;
    }
    
    cerrar() {
        this.close.emit();
    }
}
