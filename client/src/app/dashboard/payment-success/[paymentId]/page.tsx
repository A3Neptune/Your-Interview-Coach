'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentAPI, getAuthToken, removeAuthToken } from '@/lib/api';

interface Payment {
  _id: string;
  invoiceNumber: string;
  status: string;
  amount: number;
  courseId: {
    title: string;
  };
  completedAt: string;
}

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.paymentId as string;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, [paymentId, router]);

  const fetchPayment = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      const response = await paymentAPI.getPayment(paymentId);
      setPayment(response.data.payment);
    } catch (err: any) {
      if (err.response?.status === 401) {
        removeAuthToken();
        router.push('/login');
      } else {
        toast.error('Failed to load payment details');
        router.push('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await paymentAPI.getInvoice(paymentId);
      const invoiceData = response.data.invoice;

      // Create simple text invoice
      const invoiceText = `
INVOICE
========================================
Invoice Number: ${invoiceData.invoiceNumber}
Date: ${new Date(invoiceData.date).toLocaleDateString()}

BILLED TO:
${invoiceData.billTo.name}
${invoiceData.billTo.email}
${invoiceData.billTo.phone}

ITEMS:
Course: ${invoiceData.courseTitle}
Amount: ${invoiceData.currency} ${invoiceData.amount}

PAYMENT METHOD: ${invoiceData.paymentMethod.toUpperCase()}
STATUS: ${invoiceData.status.toUpperCase()}

========================================
Thank you for your purchase!
      `;

      // Download as text file
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceText));
      element.setAttribute('download', `${invoiceData.invoiceNumber}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success('Invoice downloaded');
    } catch (err) {
      toast.error('Failed to download invoice');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        {/* Success Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-zinc-400 text-lg">Your course has been unlocked and is ready to access</p>
          </div>

          {payment && (
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-left space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Invoice Number</p>
                  <p className="text-white font-semibold">{payment.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Amount Paid</p>
                  <p className="text-white font-semibold">₹{payment.amount}</p>
                </div>
              </div>

              {payment.courseId && (
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Course</p>
                  <p className="text-white font-semibold">{payment.courseId.title}</p>
                </div>
              )}

              <div>
                <p className="text-zinc-500 text-sm mb-1">Purchase Date</p>
                <p className="text-white font-semibold">
                  {new Date(payment.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleDownloadInvoice}
              className="flex-1 px-6 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Invoice
            </button>

            <Link
              href="/dashboard/content"
              className="flex-1 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Access Course
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-left">
            <p className="text-blue-300 text-sm">
              ✨ Your course is now available in "My Learning". You have full access to all lessons and materials.
            </p>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 transition-colors inline-block"
          >
            Back to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}