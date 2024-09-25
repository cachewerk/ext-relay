dnl There is a small macOS fix that was committed after v1.1.0.
AC_CANONICAL_HOST
case "$host_os" in
  darwin*)
    HIREDIS_REQ_VERSION="1.2.0"
    ;;
  *)
    HIREDIS_REQ_VERSION="1.1.0"
    ;;
esac

dnl hiredis
PKG_CHECK_MODULES([HIREDIS], [hiredis >= $HIREDIS_REQ_VERSION])

dnl hiredis_ssl
PKG_CHECK_MODULES([HIREDIS_SSL], [hiredis_ssl >= $HIREDIS_REQ_VERSION])

dnl openssl
PKG_CHECK_MODULES([OPENSSL], [openssl >= 1.1.0])

dnl libck
PKG_CHECK_MODULES([CK], [ck >= 0.7.0])

PHP_NEW_EXTENSION(yaler)
