'use client';
import React, { useState } from 'react';
import { Order } from '@/types/orders';
import { X, Download, FileText, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InvoiceModal: React.FC<{ order: Order, isOpen: boolean, onClose: () => void }> = ({ order, isOpen, onClose }) => {
  const handleDownload = () => {
    // In a real app, this would trigger a PDF generation or window.print()
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-violet-400" />
                <h2 className="text-xl font-bold text-white">Invoice</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleDownload}
                  className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-lg transition-colors print:hidden"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="text-white/60 hover:text-white p-2 rounded-lg transition-colors print:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Content (Scrollable) */}
            <div className="p-8 overflow-y-auto bg-white text-black print:p-0 print:overflow-visible">
              
              {/* Header Info */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-1">INVOICE</h1>
                  <p className="text-gray-500 font-medium">#{order.id}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-violet-600">AI Sales Assistant</h2>
                  <p className="text-gray-500 text-sm mt-1">123 Commerce Blvd</p>
                  <p className="text-gray-500 text-sm">Tech City, TC 90210</p>
                </div>
              </div>

              {/* Bill To & Details */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                  <p className="font-semibold text-gray-900">{order.billingAddress.fullName}</p>
                  <p className="text-gray-600 text-sm">{order.billingAddress.street}</p>
                  <p className="text-gray-600 text-sm">{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</p>
                  <p className="text-gray-600 text-sm">{order.customerEmail}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Date</h3>
                    <p className="font-medium text-gray-900 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</h3>
                    <p className="font-medium text-gray-900 text-sm">{order.paymentDetails.method}</p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Transaction ID</h3>
                    <p className="font-mono text-gray-600 text-xs">{order.paymentDetails.razorpayPaymentId}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="text-center py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="border-b border-gray-200">
                  {order.items.map(item => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="py-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                      <td className="py-4 text-sm text-gray-600 text-right">₹{item.price.toFixed(2)}</td>
                      <td className="py-4 text-sm font-medium text-gray-900 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-12">
                <div className="w-1/2 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="font-medium text-green-600">-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="font-medium text-gray-900">₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium text-gray-900">{order.shipping === 0 ? 'Free' : `₹${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-violet-600">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end border-t border-gray-200 pt-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</h3>
                  <p className="text-xs text-gray-500 max-w-sm">Thank you for your business. For any queries regarding this invoice, please contact support.</p>
                </div>
                <div className="flex flex-col items-center border border-gray-200 p-2 rounded-lg">
                  <QrCode className="w-16 h-16 text-gray-800" />
                  <span className="text-[10px] text-gray-400 mt-1">Scan to Verify</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
