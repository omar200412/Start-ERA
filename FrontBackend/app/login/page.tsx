'use client';

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Yönlendirme için (Next.js App Router)

// ==========================================
// İKONLAR (lucide-react paketi yerine yerel SVG olarak eklendi - Build Hatası Çözümü)
// ==========================================
const IconMail = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconLock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const IconKey = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>
);
const IconAlertCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
);
const IconCheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);
const IconRefreshCw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const IconArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);


export default function LoginPage() {
  // const router = useRouter(); // Başarılı girişte yönlendirmek için

  // --- SAYFA DURUMLARI ---
  // 'LOGIN' -> Normal giriş formu
  // 'VERIFY' -> Hesap onaylanmamışsa çıkacak olan kod girme formu
  const [step, setStep] = useState<'LOGIN' | 'VERIFY'>('LOGIN');

  // --- FORM STATELERİ ---
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [activationCode, setActivationCode] = useState<string>('');

  // --- YARDIMCI STATELER ---
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // 1. GİRİŞ YAPMA İŞLEMİ
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // TODO: BURAYA KENDİ GERÇEK BACKEND İSTEĞİNİZİ YAZACAKSINIZ
      // Örnek: const response = await axios.post('/api/login', { email, password });
      
      // -- AŞAĞISI SİMÜLASYONDUR (Gerçek API'niz olana kadar test etmeniz için) --
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
      
      // Diyelim ki veritabanınız "not verified" döndü:
      const isUserVerifiedInDatabase = false; // Bunu backendinizden gelen cevaba göre ayarlayın (örn: response.data.isVerified)
      
      if (!isUserVerifiedInDatabase) {
        // İŞTE BURASI TAM OLARAK SORUNUNUZUN ÇÖZÜLDÜĞÜ YER:
        // Hata fırlatmak yerine adımı 'VERIFY' olarak değiştiriyoruz.
        setStep('VERIFY');
        setSuccessMsg('Hesabınız onaylanmamış. Lütfen doğrulama kodunu girin.');
        setLoading(false);
        return; 
      }

      // Eğer kullanıcı onaylıysa ve şifre doğruysa:
      setSuccessMsg('Giriş başarılı! Yönlendiriliyorsunuz...');
      // router.push('/dashboard'); // Başarılıysa dashboarda at

    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // 2. KODU DOĞRULAMA İŞLEMİ
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // TODO: BURAYA GERÇEK KOD DOĞRULAMA İSTEĞİNİZİ YAZIN
      // Örnek: await axios.post('/api/verify', { email, code: activationCode });
      
      // Simülasyon:
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activationCode !== '123456') { // Test için 123456 yazdım
        throw new Error('Girdiğiniz kod hatalı veya süresi dolmuş.');
      }

      setSuccessMsg('Hesabınız başarıyla doğrulandı! Şimdi giriş yapabilirsiniz.');
      
      // Doğrulama bitince tekrar normal login ekranına döndür ve şifreyi temizle
      setTimeout(() => {
        setStep('LOGIN');
        setPassword('');
        setActivationCode('');
        setSuccessMsg(''); // Temizle ki form taze görünsün
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Doğrulama işlemi başarısız.');
    } finally {
      setLoading(false);
    }
  };

  // 3. YENİ KOD GÖNDERME İŞLEMİ
  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // TODO: BURAYA YENİDEN KOD GÖNDERME İSTEĞİNİZİ YAZIN
      // Örnek: await axios.post('/api/resend-code', { email });
      
      // Simülasyon:
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMsg(`${email} adresine yeni bir aktivasyon kodu gönderdik!`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kod gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <IconLock className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 'LOGIN' ? 'Hesabınıza Giriş Yapın' : 'Hesabınızı Doğrulayın'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {/* HATA VE BİLGİLENDİRME MESAJLARI */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
              <IconAlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {successMsg && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start">
              <IconCheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          )}

          {/* =========================================
              ADIM 1: NORMAL GİRİŞ EKRANI 
              ========================================= */}
          {step === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Adresi</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-colors"
                    placeholder="ornek@mail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Şifre</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconKey className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'İşleniyor...' : 'Giriş Yap'}
              </button>
            </form>
          )}

          {/* =========================================
              ADIM 2: HESAP ONAY KODU GİRME EKRANI 
              (Kullanıcı doğrulanmamışsa burası açılır)
              ========================================= */}
          {step === 'VERIFY' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                <p className="text-sm text-blue-800 font-medium">
                  {email} adresinize ait hesabınız henüz onaylanmamış.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  İşleme devam etmek için lütfen aktivasyon kodunu girin. (Test için 123456 yazın)
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-center mb-2">6 Haneli Kod</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-xl text-center font-mono tracking-widest border-gray-300 rounded-lg p-4 border outline-none transition-colors uppercase"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || activationCode.length < 6}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Kontrol Ediliyor...' : 'Kodu Doğrula'}
                </button>
              </form>

              {/* YENİDEN KOD İSTEME BUTONU */}
              <div className="pt-4 border-t border-gray-100 flex flex-col items-center gap-3">
                <p className="text-sm text-gray-500">Kodu bulamadınız mı?</p>
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  <IconRefreshCw className="h-4 w-4 mr-1.5" />
                  Kodu Tekrar Gönder
                </button>
              </div>
              
              <div className="text-center mt-2">
                 <button
                  type="button"
                  onClick={() => { setStep('LOGIN'); setError(''); setSuccessMsg(''); }}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center justify-center w-full"
                >
                  <IconArrowRight className="h-4 w-4 mr-1 rotate-180" />
                  Normal Girişe Dön
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}