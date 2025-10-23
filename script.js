// app.ts

// Interfaces
interface Patient {
    id: string;
    name: string;
    age: number;
    birthDate: string;
    gender: string;
    contact: string;
    responsible: string;
    familyHistory: string;
    comorbidities: string[];
    lastVisit: string;
}

interface CognitiveTest {
    id: string;
    name: string;
    score: number;
    maxScore: number;
    status: 'completed' | 'pending';
    date: string;
    category: string;
}

interface RiskAssessment {
    level: 'low' | 'medium' | 'high';
    score: number;
    factors: string[];
    recommendations: string[];
}

interface DiagnosticData {
    patient: Patient;
    tests: CognitiveTest[];
    riskAssessment: RiskAssessment;
    progression: number[];
}

// Classe principal da aplicação
class NeuroDiagnosisApp {
    private currentPatient: Patient | null = null;
    private diagnosticData: DiagnosticData | null = null;
    private isInitialized: boolean = false;

    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        try {
            await this.loadPatientData();
            this.setupEventListeners();
            this.renderDashboard();
            this.isInitialized = true;
            console.log('NeuroDiagnosis App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    private async loadPatientData(): Promise<void> {
        // Simulação de carregamento de dados
        this.currentPatient = {
            id: 'P-00482',
            name: 'Maria Oliveira',
            age: 72,
            birthDate: '1951-08-15',
            gender: 'Feminino',
            contact: '(11) 98765-4321',
            responsible: 'João Oliveira (filho)',
            familyHistory: 'Mãe com DA',
            comorbidities: ['Hipertensão', 'Diabetes'],
            lastVisit: '2023-03-15'
        };

        this.diagnosticData = {
            patient: this.currentPatient,
            tests: [
                {
                    id: 'test-1',
                    name: 'Mini-Mental (MMSE)',
                    score: 24,
                    maxScore: 30,
                    status: 'completed',
                    date: '2023-03-15',
                    category: 'cognitive'
                },
                {
                    id: 'test-2',
                    name: 'MoCA',
                    score: 18,
                    maxScore: 30,
                    status: 'completed',
                    date: '2023-03-15',
                    category: 'cognitive'
                },
                {
                    id: 'test-3',
                    name: 'CDR',
                    score: 1.0,
                    maxScore: 3.0,
                    status: 'completed',
                    date: '2023-03-10',
                    category: 'functional'
                },
                {
                    id: 'test-4',
                    name: 'Teste do Relógio',
                    score: 0,
                    maxScore: 10,
                    status: 'pending',
                    date: '',
                    category: 'visuospatial'
                }
            ],
            riskAssessment: {
                level: 'medium',
                score: 65,
                factors: [
                    'Idade avançada',
                    'Histórico familiar positivo',
                    'Pontuação MMSE reduzida',
                    'Comorbidades vasculares'
                ],
                recommendations: [
                    'Realizar exames de neuroimagem (RM ou TC de crânio)',
                    'Avaliação com geriatra para manejo de comorbidades',
                    'Iniciar acompanhamento com terapia ocupacional',
                    'Reavaliar em 6 meses com bateria completa de testes',
                    'Orientar família sobre segurança e adaptações no ambiente doméstico'
                ]
            },
            progression: [60, 70, 50, 40, 35]
        };
    }

    private setupEventListeners(): void {
        // Navegação
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link.getAttribute('href')!);
            });
        });

        // Test cards
        const testCards = document.querySelectorAll('.test-card');
        testCards.forEach(card => {
            card.addEventListener('click', () => {
                this.openTestDetails(card);
            });
        });

        // Botões de ação
        const generateReportBtn = document.querySelector('.btn-primary');
        const scheduleBtn = document.querySelector('.btn-outline');

        generateReportBtn?.addEventListener('click', () => {
            this.generateReport();
        });

        scheduleBtn?.addEventListener('click', () => {
            this.scheduleFollowUp();
        });

        // Modal
        const closeModalBtn = document.querySelector('.close-modal');
        closeModalBtn?.addEventListener('click', () => {
            this.closeModal();
        });
    }

    private renderDashboard(): void {
        if (!this.diagnosticData) return;

        this.renderPatientInfo();
        this.renderTestCards();
        this.renderRiskAssessment();
        this.renderProgressionChart();
    }

    private renderPatientInfo(): void {
        if (!this.diagnosticData) return;

        const patient = this.diagnosticData.patient;
        
        // Atualizar informações básicas
        const patientNameElement = document.querySelector('.patient-details h3');
        if (patientNameElement) {
            patientNameElement.textContent = `${patient.name}, ${patient.age} anos`;
        }

        const patientIdElement = document.querySelector('.patient-details p');
        if (patientIdElement) {
            patientIdElement.textContent = `ID: ${patient.id} | Última consulta: ${this.formatDate(patient.lastVisit)}`;
        }

        // Atualizar grid de informações
        this.updateInfoGrid();
    }

    private updateInfoGrid(): void {
        if (!this.diagnosticData) return;

        const patient = this.diagnosticData.patient;
        const infoGrid = document.querySelector('.info-grid');
        
        if (infoGrid) {
            infoGrid.innerHTML = `
                <div class="info-item">
                    <div class="info-label">Data de Nascimento</div>
                    <div class="info-value">${this.formatDate(patient.birthDate)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Gênero</div>
                    <div class="info-value">${patient.gender}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Contato</div>
                    <div class="info-value">${patient.contact}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Responsável</div>
                    <div class="info-value">${patient.responsible}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Histórico Familiar</div>
                    <div class="info-value">${patient.familyHistory}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Comorbidades</div>
                    <div class="info-value">${patient.comorbidities.join(', ')}</div>
                </div>
            `;
        }
    }

    private renderTestCards(): void {
        if (!this.diagnosticData) return;

        const testsGrid = document.querySelector('.tests-grid');
        if (!testsGrid) return;

        testsGrid.innerHTML = this.diagnosticData.tests.map(test => `
            <div class="test-card" data-test-id="${test.id}">
                <div class="test-name">${test.name}</div>
                <div class="test-status status-${test.status}">
                    ${test.status === 'completed' ? 'Concluído' : 'Pendente'}
                </div>
                <div class="test-score">
                    ${test.status === 'completed' ? `${test.score}/${test.maxScore}` : '-'}
                </div>
            </div>
        `).join('');

        // Re-adicionar event listeners
        const testCards = testsGrid.querySelectorAll('.test-card');
        testCards.forEach(card => {
            card.addEventListener('click', () => {
                this.openTestDetails(card);
            });
        });
    }

    private renderRiskAssessment(): void {
        if (!this.diagnosticData) return;

        const riskAssessment = this.diagnosticData.riskAssessment;
        const riskSection = document.querySelector('.risk-assessment');
        
        if (riskSection) {
            const riskLevelElement = riskSection.querySelector('.risk-indicator');
            const riskDetailsElement = riskSection.querySelector('.risk-details h4');
            const riskDescriptionElement = riskSection.querySelector('.risk-details p');
            const recommendationsList = riskSection.querySelector('.recommendations ul');

            if (riskLevelElement) {
                riskLevelElement.className = `risk-indicator risk-${riskAssessment.level}`;
                riskLevelElement.textContent = this.capitalizeFirstLetter(riskAssessment.level);
            }

            if (riskDetailsElement) {
                riskDetailsElement.textContent = `Risco de Demência: ${this.capitalizeFirstLetter(riskAssessment.level)}`;
            }

            if (riskDescriptionElement) {
                riskDescriptionElement.textContent = `Pontuação: ${riskAssessment.score}/100. ${this.getRiskDescription(riskAssessment.level)}`;
            }

            if (recommendationsList) {
                recommendationsList.innerHTML = riskAssessment.recommendations
                    .map(rec => `<li>${rec}</li>`)
                    .join('');
            }
        }
    }

    private renderProgressionChart(): void {
        // Implementação simplificada do gráfico
        const chartContainer = document.querySelector('.chart-container');
        if (!chartContainer || !this.diagnosticData) return;

        const progression = this.diagnosticData.progression;
        const maxValue = Math.max(...progression);
        
        chartContainer.innerHTML = `
            <div style="display: flex; align-items: flex-end; height: 100%; gap: 20px; padding: 20px; justify-content: center;">
                ${progression.map((value, index) => `
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="background: ${this.getProgressionColor(value, maxValue)}; 
                                    width: 40px; 
                                    height: ${(value / maxValue) * 80}%; 
                                    border-radius: 5px;
                                    transition: all 0.3s;">
                        </div>
                        <div style="margin-top: 10px; font-size: 0.8rem; color: #7f8c8d;">
                            ${index + 1}ª av.
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    private getProgressionColor(value: number, maxValue: number): string {
        const percentage = (value / maxValue) * 100;
        if (percentage > 70) return '#27ae60'; // Verde
        if (percentage > 40) return '#f39c12'; // Amarelo/Laranja
        return '#e74c3c'; // Vermelho
    }

    private getRiskDescription(level: string): string {
        const descriptions: { [key: string]: string } = {
            low: 'Paciente apresenta baixo risco baseado nas avaliações atuais.',
            medium: 'Paciente apresenta declínio cognitivo significativo que requer acompanhamento.',
            high: 'Paciente apresenta alto risco e requer intervenção imediata.'
        };
        return descriptions[level] || '';
    }

    private openTestDetails(card: Element): void {
        if (!this.diagnosticData) return;

        const testId = card.getAttribute('data-test-id');
        const test = this.diagnosticData.tests.find(t => t.id === testId);
        
        if (test) {
            this.showTestModal(test);
        }
    }

    private showTestModal(test: CognitiveTest): void {
        const modal = document.getElementById('testModal');
        const modalContent = modal?.querySelector('.modal-content');
        
        if (modal && modalContent) {
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h3 class="modal-title">${test.name}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="test-details">
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <div class="test-status status-${test.status}">
                            ${test.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pontuação</label>
                        <div class="test-score-large">${test.score}/${test.maxScore}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Data da Avaliação</label>
                        <div>${test.date ? this.formatDate(test.date) : 'Não realizada'}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Categoria</label>
                        <div>${this.capitalizeFirstLetter(test.category)}</div>
                    </div>
                    ${test.status === 'completed' ? `
                        <div class="form-group">
                            <label class="form-label">Interpretação</label>
                            <div>${this.interpretTestScore(test)}</div>
                        </div>
                    ` : ''}
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="app.editTest('${test.id}')">
                        <i class="fas fa-edit"></i> Editar Avaliação
                    </button>
                    <button class="btn btn-outline" onclick="app.closeModal()">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
            `;

            modal.classList.add('active');
            
            // Re-adicionar event listener para fechar
            const closeBtn = modalContent.querySelector('.close-modal');
            closeBtn?.addEventListener('click', () => this.closeModal());
        }
    }

    private interpretTestScore(test: CognitiveTest): string {
        const percentage = (test.score / test.maxScore) * 100;
        
        if (percentage >= 80) return 'Dentro da normalidade para idade e escolaridade';
        if (percentage >= 60) return 'Comprometimento cognitivo leve';
        if (percentage >= 40) return 'Comprometimento cognitivo moderado';
        return 'Comprometimento cognitivo severo';
    }

    private async generateReport(): Promise<void> {
        const button = document.querySelector('.btn-primary') as HTMLButtonElement;
        const originalText = button.innerHTML;
        
        try {
            button.innerHTML = '<span class="loading"></span> Gerando Relatório...';
            button.disabled = true;

            // Simulação de geração de relatório
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Em uma aplicação real, isso faria download do relatório
            const blob = new Blob(['Relatório gerado com sucesso'], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_${this.diagnosticData?.patient.id}_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('Relatório gerado com sucesso!', 'success');
            
        } catch (error) {
            console.error('Error generating report:', error);
            this.showNotification('Erro ao gerar relatório', 'error');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    private async scheduleFollowUp(): Promise<void> {
        // Simulação de agendamento
        this.showNotification('Consulta agendada com sucesso!', 'success');
    }

    private handleNavigation(route: string): void {
        // Implementação simplificada de navegação
        console.log('Navigating to:', route);
        // Em uma aplicação real, isso mudaria a visualização
        this.showNotification(`Navegando para ${route}`, 'info');
    }

    private closeModal(): void {
        const modal = document.getElementById('testModal');
        modal?.classList.remove('active');
    }

    public editTest(testId: string): void {
        console.log('Editing test:', testId);
        this.closeModal();
        this.showNotification('Abrindo editor de avaliação', 'info');
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    private capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
        // Implementação simplificada de notificação
        console.log(`[${type.toUpperCase()}] ${message}`);
        alert(`[${type.toUpperCase()}] ${message}`);
    }

    // Métodos públicos para integração
    public getPatientData(): Patient | null {
        return this.currentPatient;
    }

    public getDiagnosticData(): DiagnosticData | null {
        return this.diagnosticData;
    }

    public async updateTestScore(testId: string, score: number): Promise<void> {
        if (!this.diagnosticData) return;

        const test = this.diagnosticData.tests.find(t => t.id === testId);
        if (test) {
            test.score = score;
            test.status = 'completed';
            test.date = new Date().toISOString().split('T')[0];
            
            this.renderTestCards();
            this.showNotification('Pontuação atualizada com sucesso!', 'success');
        }
    }
}

// Inicialização da aplicação
declare global {
    interface Window {
        app: NeuroDiagnosisApp;
    }
}

window.app = new NeuroDiagnosisApp();