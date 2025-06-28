
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Palette, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Seu Novo Projeto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Bem-vindo ao seu repositório vazio. Este é o ponto de partida perfeito para criar algo incrível.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Rápido</h3>
            <p className="text-gray-600 leading-relaxed">
              Construído com as tecnologias mais modernas para máxima performance e velocidade.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Bonito</h3>
            <p className="text-gray-600 leading-relaxed">
              Design moderno e responsivo que funciona perfeitamente em todos os dispositivos.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <Code className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Flexível</h3>
            <p className="text-gray-600 leading-relaxed">
              Arquitetura limpa e componentes reutilizáveis para facilitar o desenvolvimento.
            </p>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-blue-500 to-purple-600 border-0 text-white">
            <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-blue-100 mb-6 max-w-md">
              Seu repositório está configurado e pronto. Comece a construir sua próxima grande ideia agora mesmo.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 font-semibold"
            >
              Começar a Desenvolver
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            Construído com React, TypeScript, Tailwind CSS e ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
