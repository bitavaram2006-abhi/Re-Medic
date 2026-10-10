import { useNavigate } from 'react-router-dom';
import { 
  Pill, 
  Bell, 
  Smartphone, 
  Shield, 
  Clock, 
  Users, 
  ArrowRight,
  Check,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: '01',
    title: 'Load Your Medicines',
    description: 'Place your pills in the smart compartments and set up your schedule through the app.',
    icon: Pill,
  },
  {
    number: '02',
    title: 'Get Timely Reminders',
    description: 'When it\'s time for your dose, the box alarm rings and the lid automatically opens.',
    icon: Bell,
  },
  {
    number: '03',
    title: 'Confirm & Track',
    description: 'Take your pills and press the green button. Your adherence is automatically logged.',
    icon: Check,
  },
  {
    number: '04',
    title: 'Stay Informed',
    description: 'Receive alerts for missed doses, low pill counts, and access your health reports anytime.',
    icon: Smartphone,
  },
];

const features = [
  {
    title: 'Smart Alerts',
    description: 'Never miss a dose with intelligent reminders that adapt to your routine.',
    icon: Bell,
  },
  {
    title: 'Automatic Tracking',
    description: 'Every dose is logged automatically, creating a complete adherence history.',
    icon: Clock,
  },
  {
    title: 'Caregiver Access',
    description: 'Family members can monitor adherence and receive alerts remotely.',
    icon: Users,
  },
  {
    title: 'Secure & Private',
    description: 'Your health data is encrypted and protected with enterprise-grade security.',
    icon: Shield,
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                <Pill className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">Re-Medic</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button variant="hero" onClick={() => navigate('/auth')}>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              <Pill className="w-4 h-4" />
              Smart Medicine Management
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Never Miss a Dose with{' '}
              <span className="text-accent">Re-Medic</span>
            </h1>
            <p className="text-lg lg:text-xl text-primary-foreground/80 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              The smart medicine reminder box that helps patients take their medications on time, 
              track adherence, and stay healthy with intelligent alerts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button 
                size="xl" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How the Smart Box Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple four-step process that ensures you never miss your medication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className="bg-card rounded-2xl p-6 shadow-md border border-border/50 hover:shadow-lg transition-all animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                  <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground/30 mt-4 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Features Built for Your Health
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed with patients and caregivers in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card rounded-2xl p-6 shadow-md border border-border/50 flex items-start gap-4 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who never miss a dose with Re-Medic
          </p>
          <Button 
            size="xl" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
            onClick={() => navigate('/auth')}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Re-Medic</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Re-Medic. Smart Medicine Reminder System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}