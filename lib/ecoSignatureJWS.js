var EcoSignatureJWS = (function(h) {
    "use strict";
    var j = function() {
        this.id = this._newGuid();
        this.generatedFileName = null;
        this.jnlpWindow = null;
        this.URLecoSignatureJWS = null;
        this.generationJNLP = 0;
        this.protocol = 0;
        this.fileGenerateJNLP = null;
        this.fileDeleteJNLP = null;
        this.maxAttemptsCreateWebSocket_JNLP = 5;
        this.tempAttemptsCreateWebSocket_JNLP = 1;
        this.portWebSocketLaunchLocal = 8282;
        this.showEvent = true;
        this.intervalWebService = 1000;
        this._comunication = 0;
        this._URLWebService = null;
        this._URLWebSocket = null;
        this._jnlp = {};
        this._isIE = this._isIE();
        this._isProtocolSecure = this._isProtocolSecure();
        this._autoPosActivate;
        this._removeJNLP;
        this._stopWebService;
        this._ws;
        this._pdfSignedB64;
        this._attemptsCreateWebSocketJNLP
    };
    j.prototype.getParamJNLP = function(a) {
        return this._jnlp[a]
    };
    j.prototype.setParamJNLP = function(a, b) {
        this._jnlp[a] = b
    };
    j.prototype.setParamsJNLP = function(a) {
        this._jnlp = Object.assign({}, a);
    };
    j.prototype.getPdfSignedB64 = function() {
        return this._pdfSignedB64
    };
    j.prototype._isProtocolSecure = function() {
        if (window.location.protocol == 'https:') return true;
        return false
    };
    j.prototype._isIE = function() {
        var a = navigator.userAgent.search(/(MSIE|Trident|Edge)/);
        return a > -1
    };
    j.prototype._newGuid = function() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16)
        }).toUpperCase()
    };
    j.prototype.launch = function() {
        this._update();
        this._validate();
        this._jnlp['ID'] = this.id;
        this._generateJNLP()
    };
    j.prototype._update = function() {
        if (typeof this._jnlp['jwsType'] !== 'undefined' && this._jnlp['jwsType'] == 1) this._comunication = 1;
        if (typeof this._jnlp['WebServiceJWS'] !== 'undefined' && this._jnlp['WebServiceJWS'] != '') this._URLWebService = this._jnlp['WebServiceJWS'];
        if (typeof this._jnlp['WebSocketJWS'] !== 'undefined' && this._jnlp['WebSocketJWS'] != '') this._URLWebSocket = this._jnlp['WebSocketJWS'];
        if (typeof this._jnlp['widget-autoPos-activate'] !== 'undefined' && this._jnlp['widget-autoPos-activate'] == 1) this._autoPosActivate = true;
        this._removeJNLP = false;
        this._stopWebService = false;
        this._pdfSignedB64 = null;
        this._attemptsCreateWebSocketJNLP = 0;
        if (typeof this.URLecoSignatureJWS !== 'undefined') {
            this.URLecoSignatureJWS = this.URLecoSignatureJWS.replace(/\\/g, '\/');
            if (this.URLecoSignatureJWS.charAt(this.URLecoSignatureJWS.length - 1) != '/') this.URLecoSignatureJWS += '/'
        }
    };
    j.prototype._validate = function() {
        if (this.id == null) alert('No se ha generado automáticamente el identificador de proceso');
        if (this.URLecoSignatureJWS == null) alert('Debe definir la url de solución ecoSignatureJWS');
        if (this.generationJNLP == null) alert('Debe definir la generación de JNLP (Servidor o Local) o dejar su valor por defecto');
        if (this.generationJNLP == 1) {
            if (this.protocol == null) alert('Debe definir el uso o no de protocolo o dejar su valor por defecto')
        }
        if (this.generationJNLP == 0) {
            if (this.fileGenerateJNLP == null) alert('Debe definir la ruta del archivo de generación de JNLP en servidor (fileGenerateJNLP)');
            else if (this.fileDeleteJNLP == null) alert('Debe definir la ruta del archivo de borrado de JNLP en servidor (fileDeleteJNLP)')
        }
        if (this._comunication == 0) {
            if (this._URLWebService == null) alert('Debe definir la url de Servicio Web. Parámetro de JNLP "WebServiceJWS"')
        }
        if (this._comunication == 1) {
            if (this._URLWebSocket == null) alert('Debe definir la url de Web Socket. Parámetro de JNLP "WebSocketJWS"')
        }
    };
    j.prototype._generateJNLP = function() {
        var d = this;
        var e = '';
        var f = null;
        if (this.generationJNLP == 0) {
            e = this._generateJNLP_Server();
            f = btoa(e);
            // $.ajax({
            //     data: {
            //         'param': f,
            //         'ID': this.id,
            //         'AutoPosEnabled': (this._autoPosActivate ? true : false),
            //         'url': btoa(this.URLecoSignatureJWS)
            //     },
            //     url: this.fileGenerateJNLP,
            //     type: 'post',
            //     beforeSend: function() {},
            //     success: function(a, b, c) {
            //         d._launchJNLP()
            //     },
            //     error: function(a, b, c) {
            //         d._error('Genetate JNLP Ajax Error: ' + a.responseText)
            //     }
            // })
            const fdata = new FormData();
            fdata.append('param', f);
            fdata.append('ID', this.id);
            fdata.append('AutoPosEnabled', (this._autoPosActivate ? true : false));
            fdata.append('url', btoa(this.URLecoSignatureJWS));
            fetch(this.fileGenerateJNLP, {
                method: "POST",
                mode: 'cors',
                cache: 'no-cache',
                body: fdata,
            }).then(response => {
                d._launchJNLP();
            }).catch(e => {
                console.log(e);
                d._error('Genetate JNLP Ajax Error');
            });
        } else {
            e = this._generateJNLP_Local();
            f = btoa(e);
            this._launchJNLP(f)
        }
    };
    j.prototype._generateJNLP_Server = function() {
        var a = '';
        for (var b in this._jnlp) {
            if (this._jnlp[b] != null) a += '<param name="' + b + '" value="' + this._jnlp[b] + '" />\n'
        }
        return a
    };
    j.prototype._generateJNLP_Local = function() {
        var a = '';
        a += '<jnlp spec="6.0+" codebase="file:/" href="">\n';
        a += '  <information>\n';
        a += '      <title>ecoBiometric JWS</title>\n';
        a += '      <vendor>Edatalia Data Solutions S.L.</vendor>\n';
        a += '      <homepage href=\"http://www.edatalia.com\"/>\n';
        a += '      <description>ecoBiometric JWS 0.9</description>\n';
        a += '  </information>\n';
        a += '  <security>\n';
        a += '      <all-permissions/>\n';
        a += '  </security>\n';
        a += '  <resources>\n';
        a += '      <!-- Application Resources -->\n';
        a += '      <j2se version="1.6+" href="http://java.sun.com/products/autodl/j2se"/>\n';
        a += '      <jar href="' + this.URLecoSignatureJWS + 'ecobiometric.jar" main="true" />\n';
        if (this._autoPosActivate == 1) {
            a += '      <jar href="' + this.URLecoSignatureJWS + 'pdfbox-2.0.6.jar"/>\n';
            a += '      <jar href="' + this.URLecoSignatureJWS + 'pdfbox-tools-2.0.6.jar"/>\n';
            a += '      <jar href="' + this.URLecoSignatureJWS + 'fontbox-2.0.6.jar"/>\n';
            a += '      <jar href="' + this.URLecoSignatureJWS + 'xmpbox-2.0.6.jar"/>\n';
            a += '      <jar href="' + this.URLecoSignatureJWS + 'commons-logging-1.1.1.jar"/>\n';
            a += '      <jar href="' + this.URLecoSignatureJWS + 'icu4j-53_1.jar"/>\n'
        }
        a += '  </resources>\n';
        a += '  <application-desc\n';
        a += '      name="ecoBiometric JWS"\n';
        a += '      main-class="ecobiometric.applet.Main">\n';
        for (var b in this._jnlp)
            if (this._jnlp[b] != null) a += '       <argument>' + b + '=' + this._jnlp[b] + '</argument>\n';
        a += '  </application-desc>\n';
        a += '  <update check="always"/>\n';
        a += '</jnlp>\n';
        if (this.protocol == 1) return a;
        else return UTF8.encode(a)
    };
    j.prototype._launchJNLP = function(a) {
        if (this.showEvent) {
            this._createWaitingWindowSigned()
        }
        if(this.jnlpWindow) {
            this.jnlpWindow.close();
            this.jnlpWindow = null;
        }
        const wFeatures = "left=0,top=0,width=520,height=160";
        if (this.generationJNLP == 0) {
            this.jnlpWindow = window.open((this.URLecoSignatureJWS + "../jnlp/" + this.id + '.jnlp').replace("http", "jnlp").replace("https", "jnlps"), "Launcher", wFeatures);
            //setTimeout(() => w.close(), 1000);
        } else {
            if (this.protocol == 1) {
                this.jnlpWindow = window.open('ecosignaturejwshelper:?ws' + (this._isProtocolSecure ? 's' : '') + ':' + this.portWebSocketLaunchLocal, "Launcher", wFeatures);
                setTimeout(this._createWebSocket_JNLP, 1, this, a)
                //setTimeout(() => w.close(), 1000);
            } else {
                if (this._isIE) {
                    dtjava.launch({
                        url: this.id + '.jnlp',
                        jnlp_content: a
                    }, {
                        jvm: '1.6+'
                    }, {})
                } else {
                    var b = atob(a);
                    var c = new Array(b.length);
                    for (var i = 0; i < b.length; i++) {
                        c[i] = b.charCodeAt(i)
                    }
                    var d = new Uint8Array(c);
                    var e = new Blob([d], {
                        type: "application/octet-stream"
                    });
                    saveAs(e, this.id + '.jnlp')
                }
            }
        }
        if (this._comunication == 0) {
            setTimeout(this._openClientWebService, 1000, this)
        } else {
            this._openClientWebSocket()
        }
    };
    j.prototype._createWebSocket_JNLP = function(c, d) {
        var e = false;
        if ('WebSocket' in window) {
            var f = new WebSocket('ws' + (c._isProtocolSecure ? 's' : '') + '://127.0.0.1:' + c.portWebSocketLaunchLocal);
            f.onopen = function() {
                if(c.jnlpWindow) {
                    c.jnlpWindow.close();
                    c.jnlpWindow = null;
                }
                f.send(d)
            };
            f.onmessage = function(a) {
                var b = a.data;
                if (b == 'OK') {
                    e = true;
                    f.close();
                    f = null
                }
            };
            f.onerror = function(a) {
                if (!e) {
                    c._attemptsCreateWebSocketJNLP++;
                    if (c._attemptsCreateWebSocketJNLP > c.maxAttemptsCreateWebSocket_JNLP) {
                        c._stopComunication();
                        c._errorHelper()
                    } else {
                        setTimeout(c._createWebSocket_JNLP, (c.tempAttemptsCreateWebSocket_JNLP * 1000), c, d)
                    }
                }
            };
            f.onclose = function() {
            }
        } else {
            if(this.jnlpWindow) {
                this.jnlpWindow.close();
                this.jnlpWindow = null;
            }
            alert('WebSocket NOT supported by your Browser!')
        }
    };
    j.prototype._openClientWebSocket = function() {
        var b = this;
        if ("WebSocket" in window) {
            this._ws = new WebSocket(this._URLWebSocket + "?" + this.id);
            this._ws.onopen = function() {};
            this._ws.onmessage = function(a) {
                b._processResponseJWS(a.data)
            };
            this._ws.onerror = function(a) {
                alert('WebSocket Message error: ' + a.data)
            };
            this._ws.onclose = function() {}
        } else {
            alert('WebSocket NOT supported by your Browser!')
        }
    };
    j.prototype._openClientWebService = function(d) {
        var e = '<?xml version="1.0" encoding="utf-8"?>' + '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' + '                   xmlns:urn="urn:JWS">' + '    <soapenv:Header/>' + '  <soapenv:Body>' + '     <urn:get_status>' + '           <ID>' + d.id + '</ID>' + '      </urn:get_status>' + '  </soapenv:Body>' + '</soapenv:Envelope>';
        // $.ajax({
        //     type: 'post',
        //     url: d._URLWebService,
        //     data: e,
        //     contentType: "text/xml; charset=utf-8",
        //     cache: false,
        //     success: function(a, b, c) {
        //         d._processResponseJWS($(a).find('result').text());
        //         if (!d._stopWebService) setTimeout(d._openClientWebService, d.intervalWebService, d)
        //     },
        //     error: function(a, b, c) {
        //         d._error('Client Web Service Ajax Error: ' + a.responseText)
        //     }
        // })
        fetch(d._URLWebService, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
            },
            cache: 'no-cache',
            body: e,
        }).then(response => {
            return response.text();
        }).then(response => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(response, "application/xml");
            var result = null;
            for(var i = 0; i < dom.all.length; i++) {
                var el = dom.all[i];
                if(el.tagName == 'result') {
                    result = el.textContent;
                    break;
                }
            }
            d._processResponseJWS(result);
            if (!d._stopWebService) setTimeout(d._openClientWebService, d.intervalWebService, d);
        }).catch(e => {
            console.log(e);
            d._error('Client Web Service Ajax Error');
        });
    };
    j.prototype._processResponseJWS = function(a) {
        if (a != 'ID_NotFound') {
            if (this.generationJNLP == 0 && !this._removeJNLP) this._deleteJNLP();
            var b = new Date();
            var c = ('0' + b.getHours()).slice(-2) + ":" + ('0' + b.getMinutes()).slice(-2) + ":" + ('0' + b.getSeconds()).slice(-2);
            var d = a.split("\n");
            for (var n = 0; n < d.length; n++) {
                if (d[n].length > 0) {
                    //var e = $('#ajaxLog').html();
                    var f = d[n].split('***');
                    // if (f[0] == 'pdfSignedB64_Working' || f[0] == 'pdfSignedB64') {
                    //     if (f[1] == '999') e = c + ': Receiving PDF Base64' + '<br/>' + e;
                    //     else if (f[1] == '998') e = c + ': Received PDF Base64' + '<br/>' + e
                    // } else e = c + ': ' + d[n] + '<br/>' + e;
                    //$('#ajaxLog').html(e);
                    if (f[0] == 'pdfSignedB64_Working' || f[0] == 'pdfSignedB64') {
                        if (f[1] == '999')
                            console.log(c + ': Receiving PDF Base64');
                        else if(f[1] == '998')
                            console.log(c + ': Received PDF Base64');
                    } else {
                        console.log(c + ': ' + d[n]);
                    }
                    this._processEventJWS(f)
                }
            }
        }
    };
    j.prototype._processEventJWS = function(a) {
        if (a[0] == 'pdfSignedB64_Working') {
            if (a[1] == '999') {
                this._pdfSignedB64 = ''
            } else if (a[1] == '998') {}
        } else if (a[0] == 'pdfSignedB64') {
            this._pdfSignedB64 += a[1]
        } else if (a[0] == 'LicError') {
            this._stopComunication();
            this._error('Error en licencia: ' + a[1])
        } else if (a[0] == 'NoStylusConnected') {
            this._stopComunication();
            this._error('No hay ningun dispositivo stylus conectado. Cancelado forzado!')
        } else if (a[0] == 'NotEnoughPoints') {
            this._stopComunication();
            this._error('Ha realizado una firma sin suficientes puntos (parametro Min_Points). Cancelado forzado!')
        } else if (a[0] == 'TimeExceeded') {
            this._stopComunication();
            this._error('La firma ha excedido su tiempo maximo. Cancelado forzado!')
        } else if (a[0] == 'NoWacomConnected') {
            this._stopComunication();
            this._error('No hay tableta conectada. Cancelado forzado!')
        } else if (a[0] == 'NoTabletConnected') {
            this._stopComunication();
            this._error('No hay tableta conectada. Cancelado forzado!')
        } else if (a[0] == 'AlreadyExists') {
            this._stopComunication();
            this._error('Ya existe una ventana de firma mostrándose en el lado cliente!. Cancelado forzado!')
        } else if (a[0] == 'JustSigned_OK') {
            this._stopComunication();
            this._success()
        } else if (a[0] == 'JustSigned_NOK') {
            this._stopComunication();
            this._error('Error, no se ha firmado el pdf correctamente, mire la consola de Java para visualizar el error y comuníqueselo a su proveedor o revise su licencia.')
        } else if (a[0] == 'NO_CERT_CAPI_FOUND') {
            this._stopComunication();
            this._error('Atención: No hay certificado de firma en Windows disponible. Cancelado forzado!')
        } else if (a[0] == 'CAPI_UNAUTHORIZED') {
            this._stopComunication();
            this._error('Atención: No se ha podido acceder a la llave privada del certificado de Windows. Cancelado forzado!')
        } else if (a[0] == 'initializing') {} else if (a[0] == 'initialized') {} else if (a[0] == 'InitialEBPBegin') {} else if (a[0] == 'InitialEBPEnd') {} else if (a[0] == 'BtnInitialCancel') {
            this._stopComunication();
            setTimeout(this._cancel, 250, this)
        } else if (a[0] == 'BtnCancel') {
            this._stopComunication();
            setTimeout(this._cancel, 250, this)
        } else if (a[0] == 'BtnAccept') {
            this._stopComunication();
            if (a[1] == '1') {
                this._success()
            } else {
                this._error("Error, no se ha firmado el pdf correctamente, mire la consola de Java para visualizar el error y comuníqueselo a su proveedor.")
            }
        } else if (a[0] == "BtnReset") {}
    };
    j.prototype._success = function() {
        if (this.showEvent) this._removeWaitingWindowSigned();
        if (this.onSuccess) {
            this.onSuccess(this);
        } else {
            if (typeof successEcoSignatureJWS !== 'undefined') {
                successEcoSignatureJWS()
            }
        }
    };
    j.prototype._cancel = function(a) {
        if (a.showEvent) a._removeWaitingWindowSigned();
        if (a.onCancel) {
            a.onCancel(a);
        } else {
            if (typeof cancelEcoSignatureJWS !== 'undefined') {
                cancelEcoSignatureJWS()
            }
        }
    };
    j.prototype._error = function(a) {
        if (this.showEvent) this._removeWaitingWindowSigned();
        if (this.onError) {
            this.onError(this, a);
        } else {
            if (typeof errorEcoSignatureJWS !== 'undefined') {
                errorEcoSignatureJWS(a)
            }
        }
    };
    j.prototype._errorHelper = function() {
        if (this.showEvent) this._removeWaitingWindowSigned();
        if(this.jnlpWindow) {
            this.jnlpWindow.close();
            this.jnlpWindow = null;
        }
        if (this.onErrorHelper) {
            this.onErrorHelper(this);
        } else {
            if (typeof errorHelperEcoSignatureJWS !== 'undefined') {
                errorHelperEcoSignatureJWS()
            }
        }
    };
    j.prototype._stopComunication = function() {
        if (this._comunication == 0) {
            this._stopWebService = true
        } else {
            if (this._ws != null) {
                this._ws.close();
                this._ws = null
            }
        }
    };
    j.prototype._deleteJNLP = function() {
        var d = this;
        if (this._removeJNLP) return;
        // $.ajax({
        //     data: {
        //         'ID': this.id
        //     },
        //     url: this.fileDeleteJNLP,
        //     type: 'post',
        //     success: function(a) {
        //         d._removeJNLP = true
        //     },
        //     error: function(a, b, c) {
        //         d._error('Delete JNLP Ajax Error: ' + a.responseText)
        //     }
        // })
        const fdata = new FormData();
        fdata.append('ID', this.id);
        fetch(this.fileDeleteJNLP, {
            method: "POST",
            mode: 'cors',
            cache: 'no-cache',
            body: fdata,
        }).then(response => {
            d._removeJNLP = true
        }).catch(e => {
            console.log(e);
            d._error('Delete JNLP Ajax Error');
        });
    };
    j.prototype._removeWaitingWindowSigned = function() {
        return;
        // $('#divWS').hide();
        // $('#divWS').remove();
        // $('#screenLockSigned').hide();
        // $('#screenLockSigned').remove()
    };
    j.prototype._createWaitingWindowSigned = function() {
        return;
        // var a = $('<div>', {
        //     id: 'screenLockSigned'
        // });
        // $('body').prepend(a);
        // $('#screenLockSigned').css({
        //     position: 'absolute',
        //     top: '0px',
        //     left: '0px',
        //     margin: '0px',
        //     padding: '0px',
        //     width: $(h).width() + 'px',
        //     height: $(h).height() + 'px',
        //     backgroundColor: 'white',
        //     opacity: '0.5',
        //     zIndex: '200'
        // });
        // var b = $('<div>', {
        //     id: 'divWS',
        //     width: '275px',
        //     height: '370px'
        // });
        // $('body').append(b);
        // $('#divWS').css({
        //     position: 'fixed',
        //     top: ($(window).height() / 2 - b.height() / 2) + 'px',
        //     left: '20px',
        //     margin: '0px',
        //     padding: '0px',
        //     border: '3px solid #0057A2',
        //     borderRadius: '5px',
        //     backgroundColor: '#FFFFFF',
        //     zIndex: '400'
        // });
        // var c = $('<div>');
        // $('#divWS').append(c);
        // c.css({
        //     position: 'absolute',
        //     top: '0px',
        //     left: '0px',
        //     height: '200px',
        //     width: '269px',
        //     margin: '0px',
        //     padding: '0px',
        //     backgroundColor: '#FFFFFF'
        // });
        // var d = $('<p>', {
        //     text: 'Esperando realización de la firma...'
        // });
        // $('#divWS').append(d);
        // d.css({
        //     position: 'absolute',
        //     top: '10px',
        //     left: '20px',
        //     margin: '0px',
        //     padding: '0px',
        //     fontSize: '12px',
        //     fontFamily: 'Arial',
        //     fontWeight: '800',
        //     color: '#0057A2'
        // });
        // var e = $('<div>');
        // c.append(e);
        // e.addClass('cssload-whirlpool');
        // var f = $('<p>', {
        //     text: 'Eventos recibidos:'
        // });
        // $('#divWS').append(f);
        // f.css({
        //     position: 'absolute',
        //     top: '190px',
        //     left: '20px',
        //     margin: '0px',
        //     padding: '0px',
        //     fontSize: '16px',
        //     fontFamily: 'Arial',
        //     fontWeight: '800',
        //     color: '#0057A2'
        // });
        // var g = $('<div>', {
        //     id: 'ajaxLog'
        // });
        // $('#divWS').append(g);
        // g.css({
        //     position: 'absolute',
        //     top: '215px',
        //     left: '20px',
        //     margin: '0px',
        //     padding: '5px 7px',
        //     width: '228px',
        //     height: '130px',
        //     border: '2px solid #0057A2',
        //     borderRadius: '5px',
        //     fontSize: '12px',
        //     fontFamily: 'Arial',
        //     fontWeight: '600',
        //     lineHeight: '1.2',
        //     overflow: 'auto',
        //     color: '#0057A2',
        //     textAlign: 'left',
        //     boxSizing: 'border-box'
        // })
    };
    return j
})(document);
